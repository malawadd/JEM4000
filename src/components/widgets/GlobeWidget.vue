<script setup>
/** Vendor */
import { ref, watch, onMounted } from "vue"
import { DateTime } from "luxon"

/** Config */
import { useServerURL } from "@/services/config"

/** Local Components */
import Globe from "../local/Globe.vue"
import Feed from "../local/Feed.vue"
import TPM from "../local/TPM.vue"

/** API */
import { fetchThxByHeight } from "@/services/api/tx"
import TransactionSimulator from "./TransactionSimulator.vue"

/** UI */
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Store */
import { useAppStore } from "@/stores/app"
const appStore = useAppStore()

const globeWidgetEl = ref(null)

const txs = ref([])
const newTxQueue = ref([])

const selectedTxHash = ref(null)  // Add this line to manage selected transaction hash

const updateTxs = (newTxs) => {
    if (Array.isArray(newTxs)) {
        newTxs.forEach(newTx => {
            if (!txs.value.some(tx => tx.hash === newTx.hash)) {
                newTxQueue.value.push(newTx)
            }
        })
    } else {
        console.log("newTxs is not an array:", newTxs)
    }
}

const processQueue = () => {
    if (newTxQueue.value.length > 0) {
        const tx = newTxQueue.value.shift()
        txs.value.push(tx)
    }
}

const fetchAndCompareTxs = async () => {
    try {
        const response = await fetchThxByHeight({})
        updateTxs(response.items)
    } catch (error) {
        console.error("Error fetching transactions:", error)
    }
}

const startPolling = () => {
    setInterval(fetchAndCompareTxs, 30_000)
}

const startQueueProcessing = () => {
    setInterval(processQueue, 3_000)
}

onMounted(async () => {
    await fetchAndCompareTxs() // Start polling immediately on mount
    startPolling() // Then start polling every 30 seconds
    startQueueProcessing() // Start processing the queue every 3 seconds
})

watch(
    () => appStore.head,
    async () => {
        if (txs.value.length) return

        const newTxs = await fetchThxByHeight({
            height: appStore.head.last_height,
            from: parseInt(DateTime.fromISO(appStore.head.last_time) / 1000),
        })
        updateTxs(newTxs)
    },
)

watch(
    () => appStore.network,
    () => {
        txs.value = []
        newTxQueue.value = []
    },
)
</script>

<template>
	<Flex ref="globeWidgetEl" justify="between" :class="$style.wrapper">
		<Globe v-if="globeWidgetEl" :parent="globeWidgetEl?.wrapper" :txs="txs" />
		<div :class="$style.atm_wrapper">
			<div :class="$style.atm" />
		</div>

		<Flex direction="column" gap="24" :class="$style.controls">
			<Flex direction="column" gap="20">
				<Flex direction="column" gap="12">
					<Flex align="center" gap="12">
						<Flex align="center" gap="8">
							<Text size="14" weight="500" color="tertiary"> Voyager API: </Text>

							<Flex align="center" gap="4">
								<Icon name="zap-circle" size="14" color="green" />
								<Text size="14" weight="600" color="green"> Stable </Text>
							</Flex>
						</Flex>

						<div :class="$style.dot" />
					</Flex>
				</Flex>

				<Dropdown fullWidth>
					<Flex align="center" gap="16" :class="$style.network_selector">
						<Flex align="center" gap="8">
							<Text size="14" weight="600" color="primary" style="text-transform: capitalize">
								StarkNet {{ appStore.network }}
							</Text>
						</Flex>

						<Icon name="chevron" size="16" color="tertiary" />
					</Flex>

					<template #popup>
						<DropdownItem @click="appStore.network = 'mainnet'">
							<Flex align="center" gap="8">
								<Icon :name="appStore.network === 'mainnet' ? 'check' : ''" size="14"
									color="secondary" /> Mainnet
							</Flex>
						</DropdownItem>
						<DropdownItem @click="appStore.network = 'sepolia'">
							<Flex align="center" gap="8">
								<Icon :name="appStore.network === 'sepolia' ? 'check' : ''" size="14"
									color="secondary" />
								Sepolia
							</Flex>
						</DropdownItem>
					</template>
				</Dropdown>
			</Flex>

			<Feed :txs="txs" @tx-selected="selectedTxHash = $event" />

			<TPM />
		</Flex>

		<Flex direction="column" justify="between"> </Flex>

	</Flex>
	<TransactionSimulator v-if="selectedTxHash" :txHash="selectedTxHash" />
</template>

<style module>
.wrapper {
	position: relative;
	width: 100%;
	height: 100%;

	overflow: hidden;
	background: var(--card-background);

	padding: 20px;
}

.atm_wrapper {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;

	pointer-events: none;

	display: flex;
	align-items: center;
	justify-content: center;
}

.atm {
	aspect-ratio: auto 1/1;
	height: 90%;

	transform-origin: center;
	transform: rotate(-52deg);

	border-radius: 50%;

	box-shadow: #1f87dd52 -0.8em 0 5.8em -1.5em inset;

	animation: fhl 20s ease infinite;
	animation-delay: 10s;
}

.atm {
	box-shadow: #2374ffe0 -2em 0 3em -0.5em inset, #000e1ad9 -3em 0 4em -1em inset, #007aec30 -60em 0 20em -40em inset;
	mix-blend-mode: color-dodge;
	color: #4c86e99e;
	filter: blur(0.2em) drop-shadow(0.3em 0 4.5em);
	touch-action: none;
}

.atm::before,
.atm::after {
	content: "";
	display: block;
	height: 100%;
	border-radius: 50%;
	box-shadow: #2d8de7 -1.5em 0 1em -1em inset;
	mix-blend-mode: color-dodge;
}

.atm::after {
	margin-top: -100%;
}

@keyframes fhl {
	0% {
		opacity: 1;
		transform: rotate(-52deg) scale(1);
	}

	15% {
		opacity: 0;
	}

	30% {
		opacity: 0;
		transform: rotate(-52deg) scale(2);
	}

	32% {
		opacity: 0;
	}

	40% {
		opacity: 1;
		transform: rotate(-52deg) scale(1);
	}

	100% {
		opacity: 1;
		transform: rotate(-52deg) scale(1);
	}
}

.controls {
	z-index: 1;
}

.dot {
	width: 6px;
	height: 6px;

	border-radius: 50%;
	background: var(--op-10);
}

.network_selector {
	width: fit-content;
	height: 38px;

	border-radius: 10px;
	border: 2px solid var(--op-5);
	cursor: pointer;

	padding: 0 14px;

	transition: all 0.2s ease;

	&:hover {
		border: 2px solid var(--op-10);
	}

	&:active {
		border: 2px solid var(--op-15);
		background: var(--op-5);
	}
}
</style>
../local/TPM.vue
