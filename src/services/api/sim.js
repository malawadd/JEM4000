import { runAgentWithPrompt } from './aiService';
import { getGroqChatCompletion } from "./groqService"

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
        const simulateTransaction = async (transactionDetails, currentNonce) => {
            console.log('Simulating transaction with details:', transactionDetails);

            const {
                type,
                version,
                sender_address,
                calldata,
                max_fee,
                signature
            } = transactionDetails;

            const incrementedNonce = (parseInt(currentNonce, 16) + 1).toString(16);
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
                            "nonce": currentNonce
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
        const currentNonce = await fetchCurrentNonce(transactionDetails.sender_address);

        // Simulate the transaction
        const simulationResult = await simulateTransaction(transactionDetails, currentNonce);
       
        
        const aiResponse = await getGroqChatCompletion(JSON.stringify(simulationResult));
        console.log('AI response:', aiResponse);

        console.log('Process completed successfully.');

        return aiResponse;

    } catch (error) {
        console.error('Error during transaction fetch and simulation process:', error);
    }
};
