import Groq from "groq-sdk";

// Initialize Groq with your API key
const groq = new Groq({ apiKey:"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" ,  dangerouslyAllowBrowser: true});

// Function to get chat completion from Groq
export const getGroqChatCompletion = async (message) => {
  try {
    console.log("message promopt", message)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You're a starknet blockchain Explorer ai , explain the given starknet tx simulation dont use jargon , and explain in simple terms , I want this infomation to not be presented as facts but as a paragraph that explain to the user the mainpoints of it , make it short and use actuall data from the tx when necessary.  the end user will not see this infomation on the website , they will click a button and get an overview. Do not reference yourself and do not ask the user for further infomation",
          role: "user",
          content: `You're a starknet blockchain Explorer ai , explain the given starknet tx simulation dont use jargon , and explain in simple terms , I want this infomation to not be presented as facts but as a paragraph that explain to the user the mainpoints of it , make it short and use actuall data from the tx when necessary.  the end user will not see this infomation on the website , they will click a button and get an overview. Do not reference yourself and do not ask the user for further infomation ${message}`,
        },
      ],
      model: "llama3-8b-8192",
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error('Error fetching chat completion from Groq:', error);
    throw error;
  }
};
