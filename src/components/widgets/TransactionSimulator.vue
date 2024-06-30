<template>
	<Flex direction="column" justify="between" gap="16" :class="$style.wrapper">
		<Flex wide justify="between">
			<div class="container">
				<button @click="simulateTransaction">Simulate Transaction</button>
			</div>
			<div class="container">
				<button @click="runi">Run AI</button>
			</div>
		</Flex>
		<div class="response-container">
			<Text v-if="simulationResult" size="16" weight="500" color="primary">Simulation Result:</Text>
			<pre v-if="simulationResult">{{ simulationResult }}</pre>
		</div>
	</Flex>
</template>

<script setup>
  /** API */
  import { fetchTransactionAndSimulate } from "@/services/api/sim"
  import { runAgentWithPrompt } from "@/services/api/aiService"
  import { ref } from "vue"
  
  const txHash = "0x1d27d322d168058c4ddbdde2e750bbecf424ab04d60548e7e0f8c29ac0f0548"
  const txt = "hi"
  const simulationResult = ref(null)
  const aiResult = ref(null)
  
  const simulateTransaction = async () => {
	console.log(`Starting simulation for transaction hash: ${txHash}`)
	try {
	  const result = await fetchTransactionAndSimulate(txHash)
	  console.log('Simulation result:', result)
	  simulationResult.value = result
	} catch (error) {
	  console.error('Error during simulation:', error)
	  simulationResult.value = `Error: ${error.message}`
	}
  }
  
  const runi = async () => {
	console.log(`Starting AI run with prompt: ${txt}`)
	try {
	  const result = await runAgentWithPrompt(txt)
	  console.log('AI result:', result)
	  aiResult.value = result
	} catch (error) {
	  console.error('Error during AI run:', error)
	  aiResult.value = `Error: ${error.message}`
	}
  }
  </script>

<style module>
.wrapper {
	min-width: 500px;
	min-height: 220px;
	background: var(--card-background);
	padding: 20px;
	width: 100%;
	/* Ensure the wrapper takes the full width */
	overflow: auto;
	/* Add scrollbars if the content overflows */
}

.container {
	flex: 1;
	/* Ensure containers take equal space */
	display: flex;
	justify-content: center;
	/* Center buttons within containers */
}

.response-container {
	margin-top: 20px;
	max-height: 300px;
	/* Set a maximum height for the response container */
	overflow: auto;
	/* Add scrollbars if the content overflows */
}

pre {
	background: var(--code-background);
	padding: 10px;
	border-radius: 4px;
	white-space: pre-wrap;
	/* Allow line wrapping */
	color: var(--txt-secondary);
	max-width: 100%;
	/* Ensure the pre element does not exceed the container's width */
	overflow: auto;
	/* Add a scrollbar if the content overflows */
}

.wrapper::-webkit-scrollbar {
	display: none;
	/* Hide the scrollbar for better appearance */
}
</style>