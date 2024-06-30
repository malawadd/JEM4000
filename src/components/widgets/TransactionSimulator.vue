<template>
	<Flex direction="column" justify="between" gap="16" :class="$style.wrapper">
		<Flex wide justify="between" align="center">
			<div :class="$style.container">
				<button :class="$style.styledButton" @click="simulateTransaction">
					Simulate Transaction
				</button>
			</div>

			<div :class="$style.selectedHash">
				<Text size="14" weight="600" color="primary"> {{ txHash }}</Text>
			</div>
		</Flex>
		<div :class="$style.responseContainer">
			<Text v-if="simulationResult" size="16" weight="500" color="primary">Simulation Result:</Text>
			<pre v-if="simulationResult">{{ simulationResult }}</pre>
		</div>
	</Flex>
</template>

<script setup>
import { fetchTransactionAndSimulate } from "@/services/api/sim"
import { runAgentWithPrompt } from "@/services/api/aiService"
import { ref, watch, toRefs } from "vue"

const props = defineProps({
    txHash: {
        type: String,
        required: true
    },
    promptText: {
        type: String,
        default: "hi"
    }
})

const { txHash, promptText } = toRefs(props)
const simulationResult = ref(null)
const aiResult = ref(null)

const simulateTransaction = async () => {
    console.log(`Starting simulation for transaction hash: ${txHash.value}`)
    try {
        const result = await fetchTransactionAndSimulate(txHash.value)
        console.log('Simulation result:', result)
        simulationResult.value = result
    } catch (error) {
        console.error('Error during simulation:', error)
        simulationResult.value = `Error: ${error.message}`
    }
}

const runAI = async () => {
    console.log(`Starting AI run with prompt: ${promptText.value}`)
    try {
        const result = await runAgentWithPrompt(promptText.value)
        console.log('AI result:', result)
        aiResult.value = result
    } catch (error) {
        console.error('Error during AI run:', error)
        aiResult.value = `Error: ${error.message}`
    }
}

watch(txHash, (newTxHash) => {
    if (newTxHash) {
        simulateTransaction()
    }
})
</script>

<style module>
.wrapper {
	min-width: 500px;
	min-height: 220px;
	background: var(--card-background);
	padding: 20px;
	width: 100%;
	overflow: auto;
}

.container {
	flex: 1;
	display: flex;
	justify-content: center;
}

.styledButton {
	width: fit-content;
	height: 38px;
	border-radius: 10px;
	border: 2px solid var(--op-5);
	cursor: pointer;
	padding: 0 14px;
	transition: all 0.2s ease;
	background: none;
	color: white;
	font-weight: 600;
	text-transform: capitalize;
	outline: none;

	&:hover {
		border: 2px solid var(--op-10);
	}

	&:active {
		border: 2px solid var(--op-15);
		background: var(--op-5);
	}
}

.selectedHash {
	margin-left: 20px;
}

.responseContainer {
	margin-top: 20px;
	max-height: 300px;
	overflow: auto;
}

pre {
	background: var(--code-background);
	padding: 10px;
	border-radius: 4px;
	white-space: pre-wrap;
	color: var(--txt-secondary);
	max-width: 100%;
	overflow: auto;
}

.wrapper::-webkit-scrollbar {
	display: none;
}
</style>
