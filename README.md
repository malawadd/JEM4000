<h1 align="center">
   <br>
  <a href=""><img src="https://i.ibb.co/z43z6ws/0623-2-2.gif" width="300"></a>
  <br>
  JEM-4000
  <br>
</h1>


<h4 align="center">A Dynamic 3D Visualization of StarkNet Transactions and Tokens</h4>

<p align="center">
  <a href="#Introduction">Introduction</a> •
  <a href="#features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#technology-used">Technology Used</a> •
  <a href="#credits">Credits</a>
</p>

### Introduction

Meet the **JEM 4000**, a cutting-edge dashboard designed to provide real-time visualization of StarkNet blockchain transactions and top tokens. Using the Voyager API, this project renders data onto a 3D globe, offering an immersive and interactive way to monitor blockchain activity and token statistics.

### Features

**Real-Time Transaction Visualization:**  
Monitor StarkNet transactions in real-time, displayed dynamically on a 3D globe.

**Top Tokens Display:**  
Get a comprehensive view of the top tokens in the StarkNet ecosystem, updated in real-time.

**Interactive 3D Globe:**  
Explore blockchain activity with a visually engaging and interactive 3D globe interface.

### How It Works

JEM-4000 transforms complex blockchain data into an accessible and interactive experience through an innovative combination of technologies:

1. **Real-Time Data Fetching:**
   - The Voyager API continuously supplies live transaction data and token statistics from the StarkNet blockchain. This real-time data feed ensures the dashboard reflects the most current blockchain activities.

2. **Data Processing:**
   - Once the data is fetched, it undergoes customized parsing to handle the large volumes efficiently. This ensures that the application remains responsive and performant, even under heavy data loads.

3. **3D Visualization:**
   - The core of the visual experience is built with Three.js and its extension, three-globe. These libraries render a fully interactive 3D globe where each transaction is mapped visually. The globe allows users to explore transactions spatially, providing a global perspective on StarkNet activity.

4. **Interactive UI:**
   - Vue 3 powers the user interface, offering a reactive and composable component structure that ensures smooth interactions. Pinia manages the state of the application, making sure that data flows seamlessly between components without unnecessary re-renders.

5. **Dynamic Data Transformation:**
   - D3.js is used for intricate data visualizations, transforming raw data into meaningful visual formats. This includes charts and graphs that depict token statistics and transaction trends.

6. **User Interaction:**
   - The interactive globe and data visualizations are not just for display; they are fully interactive. Users can click on different regions of the globe to drill down into transaction details, or hover over tokens to see real-time statistics.

7. **Elegant Styling:**
   - The application's styling is crafted with Sass, allowing for a flexible and maintainable CSS architecture. This ensures that the interface is not only functional but also visually appealing.

8. **Robust Navigation:**
   - Vue Router manages the navigation between different views and components within the application. This provides a smooth and intuitive user experience, allowing users to easily switch between viewing transaction data and token statistics.

9. **Reliable Time Management:**
   - Luxon handles all date and time formatting, ensuring that timestamps are accurate and presented in a user-friendly manner.

10. **Unique Data Identification:**
    - To maintain data integrity and consistency, uuid is used to generate unique identifiers for each transaction and token entry.

Through this sophisticated blend of technologies, the StarkNet Transaction Visualizer offers users an engaging and informative way to monitor blockchain activities, making complex data comprehensible and visually compelling.


### Transaction Fetch and Simulation

The `fetchTransactionAndSimulate` function is designed to fetch the details of a specific transaction, and simulate it. Here’s a breakdown of its functionality:

1. **Transaction Details Fetching:**
   - The function starts by fetching the transaction details from the StarkNet blockchain using the transaction hash. This is done via an API call to the Nethermind RPC endpoint.

2. **Nonce Fetching:**
   - It then fetches the current nonce for the account involved in the transaction to ensure the simulation uses the most accurate nonce.

3. **Transaction Simulation:**
   - The function simulates the transaction using the fetched details and current nonce. If a nonce error occurs, it extracts the correct nonce from the error message and retries the simulation with the corrected nonce.

4. **Error Handling:**
   - The function includes robust error handling to manage issues that may arise during the fetch and simulation processes.

5. **AI Integration:**
   - After successfully simulating the transaction, the result is passed to an AI service (Groq) for further processing and analysis.

This ensures that the transaction simulation is accurate and handles common issues related to nonce mismatches effectively.

### How To Use

1. Run `npm install` to install the required packages.
2. Run `npm run dev` to start the client application.

### Technology Used
- **Vue 3:** A progressive JavaScript framework for building user interfaces.
- **Pinia:** A store for Vue applications, designed with the Composition API in mind.
- **Three.js:** JavaScript library for creating 3D graphics.
- **three-globe:** Library for creating interactive globes with Three.js.
- **D3.js:** Library for producing dynamic, interactive data visualizations in web browsers.
- **Sass:** CSS preprocessor for styling.
- **Luxon:** Library for working with dates and times.
- **uuid:** Library for generating unique identifiers.
- **Vue Router:** Official router for Vue.js.
- **Groq:** AI service for processing and analyzing simulated transaction results.

### Credits

- **Voyager API:** Provides the real-time transaction data and token statistics.
- **Three.js and three-globe:** For the 3D visualization tools.
- **D3.js:** For the data visualization capabilities.
- **Vue 3 and Pinia:** For the framework and state management.
- **Groq API:** For AI simulation responses and analysis.
- **@vvuwei** and **@xdeq**