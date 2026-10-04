import React, { useState, useEffect, useRef } from 'react';
import './AIAssistant.css';

function AIAssistant({ metrics, suggestions, locations }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      message: "Hi! I'm your AI Carbon Assistant 🤖 I can help you understand your energy usage, find cost savings, and improve sustainability. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = (question) => {
    const q = question.toLowerCase();
    
    // Greetings and conversational starters
    if (q.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      const greetings = [
        "Hello! I'm your AI Carbon Assistant. I'm here to help you optimize your energy usage and reduce costs. What would you like to know?",
        "Hi there! I can help you understand your energy consumption, find cost savings, and improve your sustainability. How can I assist you today?",
        "Hey! Ready to save some money and help the environment? I can analyze your energy data and suggest improvements. What's on your mind?",
        "Good to see you! I've been monitoring your energy usage and I have some insights to share. What would you like to explore?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Thank you responses
    if (q.match(/(thank|thanks|appreciate)/)) {
      const thanks = [
        "You're welcome! I'm here whenever you need insights about your energy usage. Feel free to ask me anything else!",
        "Happy to help! Reducing energy costs and emissions is what I'm here for. Any other questions?",
        "My pleasure! Let me know if you want to explore other ways to optimize your energy performance.",
        "Glad I could help! I'm always monitoring for new optimization opportunities. Just ask if you need more insights!"
      ];
      return thanks[Math.floor(Math.random() * thanks.length)];
    }
    
    // How are you / conversational
    if (q.match(/(how are you|what's up|how's it going)/)) {
      return `I'm doing great! I've been busy analyzing your energy data. Currently tracking ${metrics?.total_consumption?.toFixed(0) || 500} kWh/hr with ${suggestions.length} optimization opportunities identified. How can I help you today?`;
    }
    
    // Who are you / what can you do
    if (q.match(/(who are you|what can you do|what are you|help me)/)) {
      return `I'm your AI Carbon Assistant! I can help you with:

🔋 Analyzing your real-time energy consumption
💰 Finding cost-saving opportunities
🌍 Calculating your carbon footprint
📊 Comparing building performance
🎯 Setting sustainability goals
⚠️ Explaining alerts and issues
📈 Tracking efficiency improvements

Just ask me anything about your energy usage - I speak plain English!`;
    }
    
    // Goodbye responses
    if (q.match(/(bye|goodbye|see you|talk later|gtg)/)) {
      const goodbyes = [
        "Goodbye! I'll keep monitoring your energy usage and alert you to any opportunities. Have a great day!",
        "See you later! Remember, I'm always here if you need energy insights. Take care!",
        "Talk soon! I'll be watching for ways to save you money and reduce emissions. Bye!",
        "Until next time! Keep up the great work on sustainability. Goodbye!"
      ];
      return goodbyes[Math.floor(Math.random() * goodbyes.length)];
    }

    // Cost and savings questions
    if (q.match(/(cost|save|money|expensive|cheap|bill|budget)/)) {
      const totalSavings = suggestions.reduce((sum, s) => {
        return sum + parseFloat(s.potential_savings.replace('$', '').replace('/day', ''));
      }, 0);
      
      if (totalSavings > 0) {
        return `💰 Great question! I've identified ${suggestions.length} ways to reduce your costs:

You could save $${totalSavings.toFixed(0)} per day
That's $${(totalSavings * 365).toFixed(0)} annually

Your biggest opportunity: ${suggestions[0]?.message || 'optimizing HVAC settings'}

Current hourly cost: $${metrics?.cost_per_hour || 85}

Want me to explain any specific recommendation in detail?`;
      } else {
        return `💰 Your current hourly cost is $${metrics?.cost_per_hour || 85}

That's about $${((metrics?.cost_per_hour || 85) * 24 * 30).toFixed(0)} monthly

While I don't see immediate optimization opportunities right now, I'm continuously monitoring for ways to reduce costs.

Your efficiency score of ${metrics?.efficiency_score?.toFixed(0) || 65}% suggests there's still room for improvement!`;
      }
    }
    
    // Carbon footprint questions
    if (q.match(/(carbon|emission|footprint|environment|green|sustainable|co2)/)) {
      const totalEmissions = locations ? 
        locations.reduce((sum, loc) => sum + loc.emissions, 0) :
        parseFloat(metrics?.carbon_emissions || 0);
      return `🌍 Let me break down your environmental impact:

Current carbon emissions: ${totalEmissions.toFixed(0)} kg CO₂ per hour
Daily impact: ${(totalEmissions * 24).toFixed(0)} kg CO₂

That's like ${(totalEmissions / 4.6).toFixed(1)} cars running for an hour

To offset this, you'd need ${(totalEmissions / 21.8).toFixed(1)} trees

The good news? Every 1% efficiency improvement reduces your footprint by about ${(totalEmissions * 0.01).toFixed(1)} kg CO₂ daily!`;
    }
    
    // Energy usage and consumption
    if (q.match(/(energy|usage|consumption|power|electricity|kwh)/)) {
      const highest = Math.max(metrics?.heating || 0, metrics?.cooling || 0, metrics?.equipment || 0);
      let category = 'equipment';
      if (highest === metrics?.heating) category = 'heating';
      if (highest === metrics?.cooling) category = 'cooling';
      
      return `⚡ Here's your energy breakdown:

Total consumption: ${metrics?.total_consumption?.toFixed(0) || 500} kWh/hr

Biggest user: ${category} (${highest.toFixed(0)} kWh/hr)

Efficiency score: ${metrics?.efficiency_score?.toFixed(0) || 65}%

Your ${category} systems are using ${((highest / metrics?.total_consumption) * 100).toFixed(0)}% of total energy. 

This is usually where we find the biggest savings opportunities!`;
    }
    
    // Performance and efficiency
    if (q.match(/(performance|efficiency|score|rating|compare|rank)/)) {
      if (locations) {
        const best = locations.reduce((best, loc) => loc.efficiency > best.efficiency ? loc : best);
        const worst = locations.reduce((worst, loc) => loc.efficiency < worst.efficiency ? loc : worst);
        return `📊 Here's how your locations are performing:

🏆 Best: ${best.name} at ${best.efficiency.toFixed(0)}% efficiency

⚠️ Needs work: ${worst.name} at ${worst.efficiency.toFixed(0)}% efficiency

📈 Average across all locations: ${(locations.reduce((sum, loc) => sum + loc.efficiency, 0) / locations.length).toFixed(0)}%

The efficiency gap between your best and worst locations represents $${((worst.cost - best.cost) * 24 * 365).toFixed(0)} in potential annual savings. 

Want specific recommendations for ${worst.name}?`;
      }
      return `📊 Your current efficiency score is ${metrics?.efficiency_score?.toFixed(0) || 65}%. 

Industry benchmarks show:
Average: 65% (that's you!)
Good: 75%
Excellent: 85%+

You're right at the industry average. With some optimization, we could get you to 75%+ efficiency, which would save about $${(((metrics?.cost_per_hour || 85) * 0.15) * 24 * 365).toFixed(0)} annually!`;
    }
    
    // Alerts and problems
    if (q.match(/(alert|problem|issue|wrong|error|warning)/)) {
      return `🔔 I'm constantly monitoring for issues like:

Unusual energy spikes (>20% above normal)
Equipment running inefficiently
Costs exceeding budget thresholds
Carbon emissions above targets

Right now, your systems are operating normally. I'll alert you immediately if anything changes. 

Is there a specific concern you'd like me to investigate?`;
    }
    
    // Weather impact (energy-related only)
    if (q.match(/(weather.*energy|temperature.*cost|forecast.*usage|climate.*efficiency)/)) {
      return `🌤️ Weather has a big impact on energy usage! Here's what I'm tracking:

Current conditions affect your HVAC demand
Temperature changes can increase costs by 15-30%
I predict energy needs based on weather forecasts
Hot days = higher cooling costs
Cold days = higher heating costs

Based on current weather patterns, I recommend pre-cooling during off-peak hours to avoid demand charges. 

Want specific weather-based recommendations?`;
    }
    
    // Time-based questions
    if (q.match(/(when|time|peak|schedule|hours)/)) {
      return `⏰ Timing matters for energy costs! Here's what I've learned:

Peak usage: Usually 2:00-3:00 PM (highest demand)
Best savings window: Early morning (6-8 AM)
Most efficient day: Typically Wednesday
Weekend patterns: Usually 20-30% lower usage

Pro tip: Shifting high-energy tasks to off-peak hours can save 15-25% on costs. 

Want me to suggest a specific schedule optimization?`;
    }
    
    // Specific building/location questions  
    if (q.match(/(building|location|site|facility|office|factory)/)) {
      if (locations) {
        return `🏢 You have ${locations.length} locations I'm monitoring:

${locations.map(loc => 
  `• ${loc.name}: ${loc.efficiency.toFixed(0)}% efficient, $${loc.cost.toFixed(0)}/hr`
).join('\n')}

Each location has different patterns and optimization opportunities. Which one would you like to focus on?`;
      }
      return `🏢 I'm currently monitoring this facility. Your building type and usage patterns help me provide better recommendations. What specific area would you like to optimize - HVAC, lighting, equipment, or overall efficiency?`;
    }
    
    // Off-topic questions - redirect to sustainability focus
    if (q.match(/(weather|sports|news|politics|food|movies|music|games|personal|age|where do you live|what's your favorite|tell me a joke)/) && !q.match(/(energy|cost|usage|efficiency|carbon)/)) {
      const redirects = [
        "I'm focused on helping with energy and sustainability questions! I'd love to help you reduce costs, optimize energy usage, or understand your carbon footprint. What would you like to explore?",
        "That's outside my expertise - I'm your carbon and energy specialist! I can help you save money on energy bills, reduce emissions, or improve building efficiency. What sustainability topic interests you?",
        "I'm specifically designed for energy and carbon management. Let's talk about how to optimize your energy usage, reduce costs, or meet sustainability goals. What can I help you with?",
        "I stay focused on what I do best - energy optimization and carbon footprint management! Ask me about cost savings, efficiency improvements, or environmental impact. What would you like to know?"
      ];
      return redirects[Math.floor(Math.random() * redirects.length)];
    }

    // Inappropriate or irrelevant questions
    if (q.match(/(sex|dating|relationship|personal life|family|religion|philosophy|existential|meaning of life)/)) {
      return "I'm here to help with energy and sustainability questions only. Let's focus on optimizing your carbon footprint, reducing energy costs, or improving efficiency. What can I help you with today?";
    }

    // Technical questions outside scope
    if (q.match(/(programming|code|software|app development|database|network|computer|hardware)/)) {
      return "I specialize in energy management and carbon optimization, not general technology. I can help you understand your energy data, find cost savings, or improve sustainability performance. What energy topic would you like to explore?";
    }

    // Business questions outside energy scope
    if (q.match(/(marketing|sales|hr|hiring|finance|accounting|legal|contracts)/) && !q.match(/(energy|carbon|cost|efficiency|sustainability)/)) {
      return "While I understand business, my expertise is specifically in energy management and carbon optimization. I can help with energy costs, sustainability ROI, or efficiency improvements. What energy-related business question do you have?";
    }
    // Unclear or unrecognized questions (but potentially energy-related)
    const clarifications = [
      `I want to help with your energy and sustainability questions! I can answer things like:
      
💰 "How can I save money on energy?"
🌍 "What's my carbon footprint?" 
⚡ "Which systems use the most energy?"
📊 "How efficient is my building?"
🎯 "What should I optimize first?"

What would you like to explore?`,
      
      `Let me help you with energy and carbon management! I'm great at:
      
• Finding cost-saving opportunities
• Calculating environmental impact  
• Analyzing building performance
• Suggesting efficiency improvements
• Monitoring energy systems

What specific energy topic interests you?`,
      
      `I specialize in energy optimization and carbon footprint management. Try asking:
      
"What's costing me the most in energy bills?"
"How can I reduce my carbon emissions?"  
"Which location is most efficient?"
"What energy improvements should I prioritize?"

How can I help optimize your energy usage?`
    ];
    
    return clarifications[Math.floor(Math.random() * clarifications.length)];
  };

  const handleSendMessage = (text = inputText) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      message: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(text);
      const assistantMessage = {
        type: 'assistant',
        message: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className={`ai-assistant-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className="assistant-icon">🤖</span>
        <span className="assistant-label">AI Assistant</span>
      </div>

      {isOpen && (
        <div className="ai-assistant-panel">
          <div className="assistant-header">
            <div className="assistant-info">
              <span className="assistant-avatar">🤖</span>
              <div>
                <h3>Carbon AI Assistant</h3>
                <span className="assistant-status">● Online</span>
              </div>
            </div>
            <button className="close-assistant" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.message}
                </div>
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message assistant typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your energy usage..."
              className="message-input"
            />
            <button 
              onClick={() => handleSendMessage()}
              className="send-button"
              disabled={!inputText.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIAssistant;