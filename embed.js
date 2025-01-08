(function() {
    const chatbotHTML = `
        <div class="chatbot-window">
            <div class="chatbot-header">
                <span>BellaBot</span>
                <span class="close-btn">×</span>
            </div>
            <div class="chatbot-messages"></div>
        </div>
        <div class="chatbot-widget">
            <div class="options-container">
                <div class="option" onclick="openChatbot()">
                    <div class="option-icon">
                        <img width="24" height="24" src="https://img.icons8.com/emoji/24/check-mark-emoji.png" alt="check-mark-emoji" />
                    </div>
                    Check Availability
                </div>
                <div class="option" onclick="handlePricingSpecials()">
                    <div class="option-icon">
                        <img width="24" height="24" src="https://img.icons8.com/office/24/tags.png" alt="tags" />
                    </div>
                    Pricing & Specials
                </div>
                <div class="option" onclick="handleBook()">
                    <div class="option-icon">
                        <img width="24" height="24" src="https://img.icons8.com/external-xnimrodx-blue-xnimrodx/24/external-signboard-city-scape-xnimrodx-blue-xnimrodx.png" alt="external-signboard-city-scape-xnimrodx-blue-xnimrodx" />
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;Book a Tour&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
            <div class="main-button" onclick="main()">
                <img src="icons for chatbot/chatbot-logo.png" alt="Chat Menu">
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = chatbotHTML;
    document.body.appendChild(container);
})();