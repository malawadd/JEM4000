import { runAgentWithPrompt } from './aiService';
import { getGroqChatCompletion } from "./groqService";

export const fetchTransactionAndSimulate = async (txHash) => {
    try {
        // Define the URL and headers for the fetch calls
        const baseUrl = "https://free-rpc.nethermind.io/mainnet-juno";
        const apiKey = "FMhzdrfPUr5fK5JqtFV3Z50yP8sxWnUm5TPxtQJq";
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        };

        // Function to fetch the transaction details by hash
        const fetchTransactionDetails = async (transactionHash) => {
            console.log(`Fetching transaction details for hash: ${transactionHash}`);

            const body = {
                "jsonrpc": "2.0",
                "method": "starknet_getTransactionByHash",
                "params": {
                    "transaction_hash": transactionHash
                },
                "id": 1
            };

            const response = await fetch(`${baseUrl}/?apikey=${apiKey}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const data = await response.json();
            console.log('Transaction details fetched:', data.result);
            return data.result;
        };

        // Function to fetch the current nonce for the account
        const fetchCurrentNonce = async (address) => {
            console.log(`Fetching current nonce for address: ${address}`);

            const body = {
                "jsonrpc": "2.0",
                "method": "starknet_getNonce",
                "params": {
                    "block_id": "latest",
                    "contract_address": address
                },
                "id": 1
            };

            const response = await fetch(`${baseUrl}/?apikey=${apiKey}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const data = await response.json();
            console.log('Current nonce fetched:', data.result);
            return data.result;
        };

        // Function to simulate the transaction with the fetched details
        const simulateTransaction = async (transactionDetails, nonce) => {
            console.log('Simulating transaction with details:', transactionDetails);

            const {
                type,
                version,
                sender_address,
                calldata,
                max_fee,
                signature
            } = transactionDetails;

            const incrementedNonce = (parseInt(nonce, 16) + 1).toString(16);
            const formattedNonce = '0x' + incrementedNonce.padStart(64, '0');

            const body = {
                "jsonrpc": "2.0",
                "method": "starknet_simulateTransactions",
                "params": {
                    "block_id": "pending",
                    "transactions": [
                        {
                            "type": type,
                            "version": version,
                            "sender_address": sender_address,
                            "calldata": calldata,
                            "max_fee": max_fee,
                            "signature": signature,
                            "nonce": formattedNonce
                        }
                    ],
                    "simulation_flags": [
                        "SKIP_VALIDATE"
                    ]
                },
                "id": 1
            };

            const response = await fetch(`${baseUrl}/?apikey=${apiKey}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const data = await response.json();
            console.log('Simulation result:', data.result);
            return data.result;
        };

        // Start the process
        console.log(`Starting process to fetch and simulate transaction for hash: ${txHash}`);

        // Fetch transaction details
        const transactionDetails = await fetchTransactionDetails(txHash);
        if (!transactionDetails) {
            throw new Error('Transaction details not found');
        }

        // Fetch the current nonce for the account
        let currentNonce = await fetchCurrentNonce(transactionDetails.sender_address);

        // Function to handle simulation with retries
        const handleSimulation = async (transactionDetails, nonce) => {
            try {
                let simulationResult = await simulateTransaction(transactionDetails, nonce);

                // Check for the specific error related to invalid nonce
                if (simulationResult.execution_error && simulationResult.execution_error.includes("Invalid transaction nonce")) {
                    const correctNonceMatch = simulationResult.execution_error.match(/Account nonce: Nonce\(StarkFelt\("0x([0-9a-fA-F]+)"\)\)/);
                    if (correctNonceMatch) {
                        const correctNonce = '0x' + correctNonceMatch[1];
                        console.log(`Retrying simulation with corrected nonce: ${correctNonce}`);
                        simulationResult = await simulateTransaction(transactionDetails, correctNonce);
                    }
                }

                return simulationResult;
            } catch (error) {
                console.error('Error during simulation:', error);
                throw error;
            }
        };

        // Perform simulation with possible retries
        const simulationResult = await handleSimulation(transactionDetails, currentNonce);

        const aiResponse = await getGroqChatCompletion(JSON.stringify(simulationResult));
        console.log('AI response:', aiResponse);

        console.log('Process completed successfully.');

        return aiResponse;

    } catch (error) {
        console.error('Error during transaction fetch and simulation process:', error);
    }
};
