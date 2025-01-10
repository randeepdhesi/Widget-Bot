const widget = document.querySelector('.chatbot-widget');
const mainButton = widget.querySelector('.main-button');
widget.classList.toggle('active');
mainButton.addEventListener('click', function () {

});


const chatbotWindow = document.querySelector('.chatbot-window');
const messagesContainer = document.querySelector('.chatbot-messages');
const closeBtn = document.querySelector('.close-btn');


// Close button functionality
closeBtn.addEventListener('click', () => {
    try {
        inputContainer = document.querySelector('.input-container');
        chatbotWindow.removeChild(inputContainer);
    } catch (e) { }
    chatbotWindow.style.display = 'none';
    messagesContainer.innerHTML = '';
    messagesContainer.scrollTop = 0;
    currentStep = 'welcome';
    selectedBedroom = null;
    selectedBudget = null;
    selectedMoveIn = null;
});

const conversationFlow = {
    welcome: {
        message: "Well hello there! How can I help you?",
        options: [
            { type: 'image', label: 'Studio', image: 'https://randeepdhesi.github.io/Widget-Bot/icons%20for%20chatbot/1.png' },
            { type: 'image', label: '1 Bedroom', image: 'https://randeepdhesi.github.io/Widget-Bot/icons%20for%20chatbot/3.png' },
            { type: 'image', label: '2 Bedrooms', image: 'https://randeepdhesi.github.io/Widget-Bot/icons%20for%20chatbot/5.png' },
            { type: 'image', label: '3 Bedrooms', image: 'https://randeepdhesi.github.io/Widget-Bot/icons%20for%20chatbot/8.png' },
        ],
        nextStep: 'budget'
    },
    budget: {
        message: "And how much are you willing to spend each month?",
        dynamicOptions: {
            'Studio': [
                { type: 'pill', label: 'Starting at $1915' },
                { type: 'pill', label: 'Starting at $2145' },
                { type: 'pill', label: 'Any' },
                { type: 'pill', label: 'Back' }
            ],
            '1 Bedroom': [
                { type: 'pill', label: 'Starting at $2415' },
                { type: 'pill', label: 'Starting at $2845 (Unavailable)' },
                { type: 'pill', label: 'Any' },
                { type: 'pill', label: 'Back' }
            ],
            '2 Bedrooms': [
                { type: 'pill', label: 'Starting at $2695' },
                { type: 'pill', label: 'Starting at $3115' },
                { type: 'pill', label: 'Any' },
                { type: 'pill', label: 'Back' }
            ],
            '3 Bedrooms': [
                { type: 'pill', label: 'Starting at $3275' },
                { type: 'pill', label: 'Starting at $3715' },
                { type: 'pill', label: 'Any' },
                { type: 'pill', label: 'Back' }
            ]
        },
        nextStep: 'moveIn',
        previousStep: 'welcome'
    },
    moveIn: {
        message: "When are you thinking of moving in?",
        options: [
            { type: 'pill', label: 'ASAP' },
            { type: 'pill', label: 'Next 30 Days' },
            { type: 'pill', label: 'Next 60 Days' },
            { type: 'pill', label: 'Next 90 Days' },
            { type: 'pill', label: 'Back' }
        ],
        nextStep: 'availability',
        previousStep: 'budget',
    },
    availability: {
        message: null,
        options: null
    },

    booking: {
        message: "Please enter the following details",
        options: [
            { type: 'pill', label: 'Email' },
            { type: 'pill', label: 'Phone' }
        ]
    },

    pricing: {
        message: "Enjoy Up to 15% Off Pre-sales On Select Floorplans.",
        options: [
            { type: 'pill', label: 'Request Appointment' },
            { type: 'pill', label: 'Availability' }
        ]
    },

    appointment: {
        message: "How would you like to be contacted?",
        options: [
            { type: 'pill', label: 'Email' },
            { type: 'pill', label: 'Phone' }
        ]
    },

    main: {
        message: "Well hello there! How can I help you?",
        options: [
            { type: 'pill', label: 'Photos' },
            { type: 'pill', label: 'Pet Policy' },
            { type: 'pill', label: 'Amenities' },
            { type: 'pill', label: 'Neighbourhood' },
            { type: 'pill', label: 'Location' },
            { type: 'pill', label: 'Business Hours' }
        ]
    }


};

let currentStep = 'welcome';
let selectedBedroom = null;
let selectedBudget = null;
let selectedMoveIn = null;

function addMessage(message, type = 'bot') {
    if (type == 'user') {
        clearOptions();
    }
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${type}-message`);

    // Handle potential HTML content
    if (typeof message === 'string') {
        messageElement.textContent = message;
    } else {
        messageElement.innerHTML = message;
    }

    setTimeout(() => {
        messagesContainer.appendChild(messageElement);
    }, 200);

    // Ensure scroll to bottom
    scrollToBottom();
}

function renderOptions(options, optionType = 'image') {
    clearOptions();
    if (!options || options.length === 0) return;

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('chatbot-options');

    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add(option.type === 'image' ? 'image-option' : 'pill-option');

        if (option.type === 'image') {
            optionsContainer.id = 'image-option';
            const img = document.createElement('img');
            img.src = option.image;
            img.alt = option.label;
            img.onerror = () => {
                console.warn(`Failed to load image: ${option.image}`);
                img.style.display = 'none';
            };
            optionElement.appendChild(img);
        } else {
            optionElement.textContent = option.label;
        }

        optionElement.addEventListener('click', () => handleOptionClick(option));
        optionsContainer.appendChild(optionElement);
    });

    setTimeout(() => {
        messagesContainer.appendChild(optionsContainer);
    }, 300);

    scrollToBottom();
}

function handleOptionClick(option) {
    switch (currentStep) {
        case 'welcome':
            selectedBedroom = option.label;
            addMessage(option.label, 'user');
            setTimeout(() => {
                addMessage(conversationFlow.budget.message);
                renderOptions(
                    conversationFlow.budget.dynamicOptions[selectedBedroom],
                    'pill'
                );
                currentStep = 'budget';
            }, 500);
            break;
        case 'budget':
            if (option.label === 'Back') {
                handleBack();
                break;
            }
            selectedBudget = option.label;
            addMessage(option.label, 'user');
            setTimeout(() => {
                addMessage(conversationFlow.moveIn.message);
                renderOptions(conversationFlow.moveIn.options, 'pill');
                currentStep = 'moveIn';
            }, 500);
            break;

        case 'moveIn':
            if (option.label === 'Back') {
                handleBack();
                break;
            }
            selectedMoveIn = option.label;
            addMessage(option.label, 'user');
            setTimeout(() => {
                addMessage(conversationFlow.availability.message);
                clearOptions();
                // Filter properties based on selected bedroom type and budget
                if (selectedBudget === 'Any') {
                    selectedBudget = '999999'; // Set to high value to include all properties
                }
                const filteredProperties = filterProperties(selectedBedroom, selectedBudget);

                // If properties exist, generate cards
                if (filteredProperties.length > 0) {
                    filteredProperties.forEach(property => {
                        generateCard(property);
                    });
                } else {
                    addMessage("Sorry, no properties match your selection.");
                }
                currentStep = 'availability';
            }, 500);
            break;

        case 'pricing':
            if (option.label === 'Availability') {
                try {
                    messagesContainer.removeChild(option.label);
                }
                finally {
                    openChatbot();
                }
            }
            else {
                addMessage(option.label, 'user');
                setTimeout(() => {
                    addMessage(conversationFlow.appointment.message);
                    renderOptions(conversationFlow.appointment.options, 'pill');
                    currentStep = 'appointment';
                }, 1000);
                break;
            }

        case 'appointment':
            addMessage(option.label, 'user');
            if (option.label == 'Email') {
                clearOptions()
                Form('Email')
            }
            else {
                clearOptions()
                Form('Phone Number')
            }
            break;

        case 'booking':
            addMessage(option.label, 'user');
            if (option.label == 'Email') {
                clearOptions()
                Form('Email', calender = true)
            }
            else {
                clearOptions()
                Form('phone number', calender = true)
            }
            break;

        case 'main':
            addMessage(option.label, 'user');
            if (option.label == 'Photos') {
                setTimeout(() => {
                    Carousel();
                }, 300);
            }
            break;

    }
}

function clearOptions() {
    const optionsContainer = document.querySelector('.chatbot-options');
    if (optionsContainer) optionsContainer.remove();
}


function handleBack() {
    const previousStep = conversationFlow[currentStep].previousStep;
    if (previousStep) {
        // Clear the last user message and bot response
        const userMessage = messagesContainer.getElementsByClassName('user-message');
        const botMessage = messagesContainer.getElementsByClassName('bot-message');

        messagesContainer.removeChild(userMessage[userMessage.length - 1]);
        messagesContainer.removeChild(botMessage[botMessage.length - 1]);
        messagesContainer.removeChild(botMessage[botMessage.length - 1]);

        // Update current step
        currentStep = previousStep;

        // Reset selected values based on step
        if (currentStep === 'welcome') {
            selectedBedroom = null;
        } else if (currentStep === 'budget') {
            selectedBudget = null;
        } else if (currentStep === 'moveIn') {
            selectedMoveIn = null;
        }

        // Re-render the appropriate options for the previous step
        if (currentStep === 'welcome') {
            addMessage(conversationFlow.welcome.message);
            renderOptions(conversationFlow.welcome.options);
        } else if (currentStep === 'budget') {
            addMessage(conversationFlow.budget.message);
            renderOptions(conversationFlow.budget.dynamicOptions[selectedBedroom], 'pill');
        } else if (currentStep === 'moveIn') {
            addMessage(conversationFlow.moveIn.message);
            renderOptions(conversationFlow.moveIn.options, 'pill');
        } else if (currentStep === 'pricing') {
            addMessage(conversationFlow.pricing.message);
            renderOptions(conversationFlow.pricing.options, 'pill');
        }
    }
}
function scrollToBottom() {
    // Slight delay to ensure DOM updates
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
}

// Expose function to open chatbot from external widget
openChatbot = function () {
    try {
        inputContainer = document.querySelector('.input-container');
        chatbotWindow.removeChild(inputContainer);
    } catch (e) { }
    chatbotWindow.style.display = 'flex';
    messagesContainer.innerHTML = ''; // Clear any previous messages
    currentStep = 'welcome';

    // Add welcome message
    addMessage(conversationFlow.welcome.message);

    // Render welcome options after a short delay
    setTimeout(() => {
        renderOptions(conversationFlow.welcome.options);
    }, 100);
}

handlePricingSpecials = function () {
    try {
        inputContainer = document.querySelector('.input-container');
        chatbotWindow.removeChild(inputContainer);
    } catch (e) { }
    chatbotWindow.style.display = 'flex';
    messagesContainer.innerHTML = ''; // Clear any previous messages
    currentStep = 'pricing';

    addMessage(conversationFlow.pricing.message);

    // Render welcome options after a short delay
    setTimeout(() => {
        renderOptions(conversationFlow.pricing.options);
    }, 100);
}

handleBook = function () {
    try {
        inputContainer = document.querySelector('.input-container');
        chatbotWindow.removeChild(inputContainer);
    } catch (e) { }
    chatbotWindow.style.display = 'flex';
    messagesContainer.innerHTML = ''; // Clear any previous messages
    currentStep = 'booking';

    addMessage(conversationFlow.booking.message);

    // Render welcome options after a short delay
    setTimeout(() => {
        renderOptions(conversationFlow.booking.options);
    }, 100);
}

main = function () {
    try {
        inputContainer = document.querySelector('.input-container');
        chatbotWindow.removeChild(inputContainer);
    } catch (e) { }
    chatbotWindow.style.display = 'flex';
    messagesContainer.innerHTML = ''; // Clear any previous messages
    currentStep = 'main';

    addMessage(conversationFlow.main.message);

    // Render welcome options after a short delay
    setTimeout(() => {
        renderOptions(conversationFlow.main.options);
        chatbotWindow.appendChild(inputContainer);
    }, 100);
}


// Example of property listings, could be fetched from a database or API
const propertyListings = [
    {
        price: "$1,915/month",
        title: "S1",
        beds: "1",
        baths: "1",
        sqft: "390",
        address: "123 Main St, Downtown",
        type: "Studio",
        image: "https://randeepdhesi.github.io/Widget-Bot/properties_photos/1.png"
    },
    {
        price: "$1,000/month",
        title: "S3",
        beds: "1",
        baths: "1",
        sqft: "464",
        address: "456 High St, Downtown",
        type: "Studio",
        image: "https://randeepdhesi.github.io/Widget-Bot/properties_photos/2.png"
    },
    {
        price: "$1,000/month",
        title: "A1",
        beds: "1",
        baths: "1",
        sqft: "624",
        address: "789 Oak St, Downtown",
        type: "1 Bedroom",
        image: "https://randeepdhesi.github.io/Widget-Bot/properties_photos/3.png"
    },
    {
        price: "$1,000/month",
        title: "J1",
        beds: "2",
        baths: "1",
        sqft: "709",
        address: "101 Maple St, Downtown",
        type: "2 Bedrooms",
        image: "https://randeepdhesi.github.io/Widget-Bot/properties_photos/4.png"
    },
    {
        price: "$3,115/month",
        title: "J7",
        beds: "2",
        baths: "2",
        sqft: "840",
        address: "202 Pine St, Downtown",
        type: "2 Bedrooms",
        image: "https://randeepdhesi.github.io/Widget-Bot/properties_photos/5.png"
    },
    {
        price: "$1,000/month",
        title: "R3",
        beds: "3",
        baths: "2",
        sqft: "960",
        address: "202 Pine St, Downtown",
        type: "3 Bedrooms",
        image: "https://randeepdhesi.github.io/Widget-Bot/properties_photos/6.png"
    },
    {
        price: "$3,715/month",
        title: "R8",
        beds: "3",
        baths: "2",
        sqft: "973",
        address: "202 Pine St, Downtown",
        type: "3 Bedrooms",
        image: "https://randeepdhesi.github.io/Widget-Bot/properties_photos/7.png"
    }
];

// Function to filter properties based on user's selection
function filterProperties(bedroomType, budget) {
    return propertyListings.filter(property => {
        const price = parseInt(property.price.replace(/[^\d]/g, ''), 10);
        const maxBudget = parseInt(budget.replace(/[^\d]/g, ''), 10);

        // Return properties that match bedroom type and price range
        return property.type === bedroomType && price <= maxBudget;
    });
}

function generateCard(property) {
    const card = document.createElement('div');
    card.classList.add('property-card');

    card.innerHTML = `
                <div class="property-image">
                    <img src="${property.image}" alt="Property Image" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="property-content">
                    <button class="see-details-btn">See Details</button>
                </div>
                
            `;

    // Add the card to the container
    messagesContainer.appendChild(card);

    // Add event listener for the "See Details" button
    const seeDetailsButton = card.querySelector('.see-details-btn');
    seeDetailsButton.addEventListener('click', () => {
        alert('Redirecting to details page...');
    });

    // Scroll to the bottom of the container
    scrollToBottom();
}

function Carousel() {
    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('carousel-container');

    // Carousel structure
    carouselContainer.innerHTML = `
                <div class="carousel">
                    <div class="carousel-track">
                        <div class="carousel-slide"><img src="https://randeepdhesi.github.io/Widget-Bot/properties_photos/8.png" alt="Image 1"></div>
                        <div class="carousel-slide"><img src="https://randeepdhesi.github.io/Widget-Bot/properties_photos/9.png" alt="Image 1"></div>
                        <div class="carousel-slide"><img src="https://randeepdhesi.github.io/Widget-Bot/properties_photos/10.png" alt="Image 1"></div>
                        <div class="carousel-slide"><img src="https://randeepdhesi.github.io/Widget-Bot/properties_photos/11.png" alt="Image 1"></div>
                        <div class="carousel-slide"><img src="https://randeepdhesi.github.io/Widget-Bot/properties_photos/12.png" alt="Image 1"></div>
                        <div class="carousel-slide"><img src="https://randeepdhesi.github.io/Widget-Bot/properties_photos/13.png" alt="Image 1"></div>
                    </div>
                    <button class="carousel-btn carousel-btn-left">&lt;</button>
                    <button class="carousel-btn carousel-btn-right">&gt;</button>
                </div>
            `;

    messagesContainer.appendChild(carouselContainer);

    // Carousel logic
    const track = carouselContainer.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carouselContainer.querySelector('.carousel-btn-right');
    const prevButton = carouselContainer.querySelector('.carousel-btn-left');
    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange slides next to each other
    slides.forEach((slide, index) => {
        slide.style.left = `${index * slideWidth}px`;
    });

    let currentIndex = 0;

    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    requestAnimationFrame(() => {
        carouselContainer.classList.remove('hidden');
    });
}

const inputField = document.createElement('input');
inputField.type = 'text';
inputField.placeholder = 'Ask me anything...';
inputField.classList.add('chat-input');

const sendButton = document.createElement('button');
sendButton.textContent = 'Send';
sendButton.classList.add('send-btn');

const inputContainer = document.createElement('div');
inputContainer.classList.add('input-container');
inputContainer.appendChild(inputField);
inputContainer.appendChild(sendButton);

function Form(contact, calender = false) {
    let questions;
    if (calender == true) {
        questions = [
            "What is your name?",
            `What is your ${contact}?`,
            "What is your preferred contact date?",
            "To better assist you, please let me know why you would like to be contacted, or if you’d like to book an appointment when a team member reaches out."
        ];
    } else {
        questions = [
            "What is your name?",
            `What is your ${contact}?`,
            "To better assist you, please let me know why you would like to be contacted, or if you’d like to book an appointment when a team member reaches out."
        ];
    }

    const answers = {};
    let currentQuestionIndex = 0;

    const chatbotWindow = document.querySelector('.chatbot-window');
    chatbotWindow.appendChild(inputContainer);

    const askQuestion = () => {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            addMessage(question);

            // Adjust input type based on the question
            if (question.includes('contact date')) {
                inputField.type = 'date';
                inputField.placeholder = ''; // No placeholder for date
            } else {
                inputField.type = 'text';
                inputField.placeholder = 'Ask me anything...';
            }

            inputField.value = '';
        } else {
            // All questions answered, handle data submission
            chatbotWindow.removeChild(inputContainer);

            console.log(JSON.stringify(answers)); // Log answers as JSON

            addMessage(
                'Thank you message: Thank you for your interest in our property. A team member will reach out to you shortly.',
                'bot'
            );
        }
    };

    const handleUserResponse = () => {
        const userAnswer = inputField.value.trim();
        if (userAnswer || inputField.type === 'date') { // Allow empty value for date picker
            // Save the answer and move to the next question
            answers[currentQuestionIndex] = userAnswer;
            addMessage(userAnswer || 'No date selected', 'user'); // Default text if no date provided
            currentQuestionIndex++;
            askQuestion();
        }
    };

    // Add event listener for the send button
    sendButton.addEventListener('click', handleUserResponse);

    // Add event listener for the Enter key
    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleUserResponse();
        }
    });



    sendButton.addEventListener('click', () => {
        const userAnswer = inputField.value.trim();
        if (userAnswer) {
            // Save the answer and move to the next question
            const currentQuestion = questions[currentQuestionIndex];
            answers[currentQuestionIndex] = userAnswer; // Store by index or question key
            addMessage(userAnswer, 'user');
            currentQuestionIndex++;
            askQuestion();
        }
    });
    askQuestion();
}

