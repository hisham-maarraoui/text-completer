const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

console.log('API Key status:', {
    exists: !!API_KEY,
    length: API_KEY?.length,
    firstChars: API_KEY ? `${API_KEY.substring(0, 4)}...` : 'none'
});

export const llmService = {
    getSuggestion: async (currentText) => {
        // Input validation
        if (!currentText?.trim()) {
            console.log('Empty or invalid input text');
            return '';
        }

        // Validate API key
        if (!API_KEY) {
            console.error('API key is missing');
            throw new Error('API key is not configured');
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "X-Title": "Text Completer Extension",
                    "HTTP-Referer": window.location.origin,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "deepseek/deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a helpful text completion assistant. Complete the given text naturally and concisely."
                        },
                        {
                            "role": "user", 
                            "content": `Complete this text naturally. Only provide the completion, no explanations: ${currentText.trim()}`
                        }
                    ],
                    "max_tokens": 50,
                    "temperature": 0.3,
                    "stream": false,
                    "stop": ["\n", ".", "!", "?"] // Stop at natural sentence endings
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API request failed: ${response.status} ${response.statusText}\n${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            
            // Debug logging
            console.log('API Response:', {
                id: data.id,
                model: data.model,
                choices: data.choices?.length,
                usage: data.usage
            });

            // Validate response structure
            if (!data?.choices?.[0]?.message?.content) {
                console.warn('Invalid response structure:', data);
                return '';
            }

            const suggestion = data.choices[0].message.content.trim();
            
            // Validate suggestion
            if (!suggestion) {
                console.warn('Empty suggestion received');
                return '';
            }

            console.log('Final suggestion:', suggestion);
            return suggestion;

        } catch (error) {
            console.error('Error in getSuggestion:', error);
            throw error; // Let the caller handle the error
        }
    }
}
// const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
// const API_URL = "https://openrouter.ai/api/v1/chat/completions"

// export const llmService = {
//     getSuggestion: async (currentText) => {
//         console.log('API Key present:', !!API_KEY, 'First few chars:', API_KEY?.substring(0, 4));
//         console.log('Input text:', currentText);

//         try {const response = await fetch(API_URL, {
//             method: "POST",
//             headers: {
//               "Authorization": `Bearer ${API_KEY}`,
//               "X-Title": "Text Completer Extension",
//               "HTTP-Referer": window.location.origin,
//               "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//               "model": "openai/o3-mini-high",
//               "messages": [
//                 {
//                     "role": "user", 
//                     "content": `Im giving you the beginning of a sentence, you job is to predict the 
//                     next few words in order to complete the phrase or sentence. Do not repeat what is 
//                     already in the sentence; just continue off where is ends: "${currentText}"`
//                 }
//               ],
//               "max_tokens": 20,
//               "temperature": 0.90,
//               "stream": false,
//               "repetition_penalty": 1
//             })
//           });

//         if (!response.ok) {
//             throw new Error("API Fetch not succesful")
//         }

//         const data = await response.json();
//         // console.log(`AI Suggestion: ${data}`)

//         // if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
//         //     console.error('Unexpected API response structure:', data);
//         //     return '';
//         // }

//         const suggestion = data.choices[0].message.content;
//         console.log(`AI Suggestion: ${suggestion}`)
//         return suggestion;

//         } catch (error) {
//             console.log(`The error is: "${error.message} | "${error.stack}"`)
//             return '';
//         }
//     }
// }