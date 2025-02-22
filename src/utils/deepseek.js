const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const deepseekService = {
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
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Text Completer Extension",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "deepseek/deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a helpful text completion assistant."
                        },
                        {
                            "role": "user", 
                            "content": `Complete this text naturally. Only provide the sentence continuation, no explanations. 
                            It should be just a few words (No more than 10 words), or more if needed to complete the thought: ${currentText.trim()}`
                        }
                    ],

                    "temperature": 0.3,
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