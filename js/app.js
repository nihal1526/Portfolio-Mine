/**
 * Nihal S Jain - Portfolio Core Application Logic
 * Implements smooth IntersectionObserver-based scroll reveals, 
 * navigation tracking, menu toggling, contact form submissions, and the AI Chatbot.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. LOADER OVERLAY DISMISSAL
    // ==========================================================================
    const loader = document.getElementById('loader-overlay');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }
        }, 600);
    });

    if (document.readyState === 'complete') {
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }
        }, 600);
    }

    // ==========================================================================
    // 2. RESPONSIVE SCROLL REVEALS & LATERAL NAV TRACKER (IntersectionObserver)
    // ==========================================================================
    const lateralNavLi = document.querySelectorAll('#lateral-nav ul li:not(.nav-section-title)');
    const lateralSceneTitle = document.querySelector('.scene-title');
    const lateralSceneDesc = document.querySelector('.scene-desc');
    const scrollTexts = document.querySelectorAll('.scroll-overlay-text');
    const scrollSections = document.querySelectorAll('.scroll-section');

    const sectionMetadata = {
        origin: { title: 'ORIGIN', desc: 'Nihal S Jain / AI Automation Engineer. Defining workflows.' },
        about: { title: 'ABOUT', desc: '01. Background, Core Skills, and Adaptability.' },
        services: { title: 'SERVICES', desc: '02. n8n, Make, Vector Search, AI agents.' },
        projects: { title: 'PROJECTS', desc: '03. Transaction monitors, WhatsApp bots, RAG pipelines.' },
        contact: { title: 'CONTACT', desc: '04. Instant AI reply or Direct form dispatch.' }
    };

    // --- Observer A: Scroll reveals on text elements ---
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px" // trigger slightly before passing
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            } else {
                // Remove class when scrolled away to replicate sidewave fade-out effect
                entry.target.classList.remove('reveal-visible');
            }
        });
    }, revealOptions);

    scrollTexts.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Observer B: Active Section Tracker for Lateral Nav ---
    const sectionOptions = {
        threshold: 0.2,
        rootMargin: "-25% 0px -35% 0px" // focuses tracking on the viewport center zone
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateLateralNav(entry.target.id);
            }
        });
    }, sectionObserverOptions = sectionOptions);

    scrollSections.forEach(sec => {
        sectionObserver.observe(sec);
    });

    function updateLateralNav(sectionId) {
        // Highlight corresponding item in lateral navigation
        lateralNavLi.forEach(li => {
            const link = li.querySelector('a');
            if (link && link.getAttribute('href') === `#${sectionId}`) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });

        // Update corresponding item in menu drawer
        const menuItems = document.querySelectorAll('.menu-nav li');
        menuItems.forEach(li => {
            if (li.getAttribute('data-target') === sectionId) {
                li.classList.add('active-item');
            } else {
                li.classList.remove('active-item');
            }
        });

        // Update titles on lateral tracker
        if (sectionMetadata[sectionId]) {
            if (lateralSceneTitle) lateralSceneTitle.textContent = sectionMetadata[sectionId].title;
            if (lateralSceneDesc) lateralSceneDesc.textContent = sectionMetadata[sectionId].desc;
        }
    }

    // ==========================================================================
    // 3. FULL-SCREEN NAVIGATION PANEL
    // ==========================================================================
    const menuBtn = document.getElementById('menu-btn');
    const menuPanel = document.getElementById('menu-panel');
    const openLabel = menuBtn ? menuBtn.querySelector('.open-label') : null;
    const closeLabel = menuBtn ? menuBtn.querySelector('.close-label') : null;
    const menuLinks = document.querySelectorAll('.menu-nav a');

    function toggleMenu() {
        if (!menuPanel) return;
        
        const isOpen = menuPanel.classList.toggle('open');
        
        if (isOpen) {
            if (openLabel) openLabel.style.display = 'none';
            if (closeLabel) closeLabel.style.display = 'inline';
            document.documentElement.style.overflow = 'hidden';
        } else {
            if (openLabel) openLabel.style.display = 'inline';
            if (closeLabel) closeLabel.style.display = 'none';
            document.documentElement.style.overflow = '';
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            toggleMenu();

            const targetSec = document.querySelector(targetId);
            if (targetSec) {
                setTimeout(() => {
                    targetSec.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        });
    });

    // ==========================================================================
    // 4. INTERACTIVE CHATBOT PANEL DRAWER
    // ==========================================================================
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotPanel = document.getElementById('chatbot-panel');
    const chatbotBackdrop = document.querySelector('.chatbot-backdrop');
    const chatbotTriggerBoxes = document.querySelectorAll('.chatbot-btn-trigger');

    function openChatbot() {
        if (chatbotPanel) {
            chatbotPanel.classList.add('open');
            document.documentElement.style.overflow = 'hidden';
        }
    }

    function closeChatbot() {
        if (chatbotPanel) {
            chatbotPanel.classList.remove('open');
            document.documentElement.style.overflow = '';
        }
    }

    if (chatbotToggleBtn) chatbotToggleBtn.addEventListener('click', openChatbot);
    if (chatbotCloseBtn) chatbotCloseBtn.addEventListener('click', closeChatbot);
    if (chatbotBackdrop) chatbotBackdrop.addEventListener('click', closeChatbot);

    chatbotTriggerBoxes.forEach(box => {
        box.addEventListener('click', openChatbot);
    });

    // ==========================================================================
    // 5. CHATBOT BOT CONVERSATION ENGINE
    // ==========================================================================
    const chatMessagesContainer = document.getElementById('chatbot-messages');
    const chatInputForm = document.getElementById('chatbot-input-form');
    const chatInputEl = document.getElementById('chatbot-user-msg');
    const suggestionBtns = document.querySelectorAll('.suggest-btn');

    const botKnowledge = {
        greetings: {
            keywords: ['hello', 'hi', 'hey', 'greetings', 'yo'],
            response: "HELLO! I'M NIHAL'S CHATBOT COGNITIVE COUPLER. YOU CAN ASK ME ABOUT HIS TECHNICAL STACK, COMPLETED PROJECTS, WORK SUMMARY, OR EDUCATION. WHAT TRANSCRIPT ARE WE LOGGING?"
        },
        skills: {
            keywords: ['skill', 'stack', 'tool', 'technolog', 'program', 'python', 'languages'],
            response: "NIHAL'S CORE SKILLS INVOLVE:\n\n- AUTOMATION: n8n, MAKE (INTEGROMAT), ZAPIER, WEBHOOKS, REST APIs.\n- PROGRAMMING & AI: PYTHON, PYTORCH, TENSORFLOW, OPENCV, PANDAS.\n- DATABASES & VECTOR STORES: SQL, MONGODB ATLAS VECTOR SEARCH, MICROSOFT EXCEL.\n- SYSTEMS: AI AGENTS, RAG PIPELINES, TELEGRAM/WHATSAPP META CHANNELS."
        },
        projects: {
            keywords: ['project', 'portfolio', 'work', 'code', 'deploy'],
            response: "NIHAL HAS BUILT SIX CORE PROJECTS:\n\n1. AI-WEBCHAT-ASSISTANT: INTEGRATES n8n LOGIC WITH MONGODB MEMORY STORAGE.\n2. TRON-WALLET-TRACKER: AN TRANSACTION ALERT MONITOR FOR TRC20 TRANSACTIONS.\n3. WHATSAPP-AI-AUTO-REPLY: CONNECTING META WHATSAPP API WITH GOOGLE GEMINI MODELS.\n4. PDF-READER AGENT: EFFICIENT DOCUMENT PARSER WITH VECTOR RETRIEVAL INTERFACES.\n5. MESSENGER-AUTOMATION: LEADS CAPTURED VIA MESSENGER TO SHEETS WORKFLOW.\n6. RAG AI AGENT: SECURE BUSINESS ASSISTANT USING ATLAS VECTOR INDEX."
        },
        experience: {
            keywords: ['experience', 'work', 'job', 'company', 'arn', 'innovations', 'present', 'resume'],
            response: "NIHAL CURRENTLY SERVES AS AN IT SUPPORT & AI AUTOMATION EXECUTIVE AT ARN INNOVATIONS TECHNOLOGY LLC IN DUBAI (2025 - PRESENT).\n\nKEY CONTRIBUTIONS:\n- DESIGNED AI CONVERSATIONAL AGENTS VIA n8n COMBINED WITH VECTOR DATA LOADERS.\n- CREATED END-TO-END WORKFLOWS REDUCING MANUAL DATA ACTIONS SYSTEM-WIDE.\n- SETUP TELEGRAM & WHATSAPP META BUSINESS CONNECTORS FOR AUTOMATED USER PIPELINES.\n- MANAGED IT OPERATIONS SUPPORT STACKS AND STANDARDIZED visibility systems."
        },
        education: {
            keywords: ['education', 'degree', 'study', 'college', 'university', 'srinivas'],
            response: "NIHAL HOLDS A BACHELOR OF ENGINEERING (B.E.) IN ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING FROM SRINIVAS INSTITUTE OF TECHNOLOGY, MANGALURU."
        },
        certifications: {
            keywords: ['certification', 'course', 'certify', 'credential', 'google', 'microsoft'],
            response: "NIHAL HAS EARNED SEVERAL PREMIUM CREDENTIALS:\n\n- INFORMATION TECHNOLOGY SPECIALIST - ARTIFICIAL INTELLIGENCE.\n- FROM DATA TO INSIGHTS WITH GOOGLE CLOUD.\n- MICROSOFT CERTIFIED: POWER PLATFORM FUNDAMENTALS."
        },
        contact: {
            keywords: ['contact', 'email', 'phone', 'reach', 'number', 'address', 'location', 'dubai'],
            response: "YOU CAN CONNECT WITH NIHAL VIA:\n\n- EMAIL: nihalsjain152002@gmail.com\n- PHONE: +971 554491295\n- LOCATION: Burjuman, Dubai, UAE\n- GITHUB: github.com/Nihalsjain\n\nOR SIMPLY FILL IN THE DISPATCH FORM IN THE 'REACH OUT' SECTION ON THIS PAGE!"
        },
        default: {
            response: "I REGISTERED YOUR PACKET BUT COULD NOT COMPILE A PERFECT MATCH. TRY ASKING ABOUT HIS 'AUTOMATION SKILLS', 'WORK EXPERIENCE', 'PROJECT DETAILS', OR 'CONTACT INFRASTRUCTURE'."
        }
    };

    function findMatch(userInput) {
        const inputLower = userInput.toLowerCase();
        for (const key in botKnowledge) {
            if (key === 'default') continue;
            const matchFound = botKnowledge[key].keywords.some(kw => inputLower.includes(kw));
            if (matchFound) {
                return botKnowledge[key].response;
            }
        }
        return botKnowledge.default.response;
    }

    function appendMessage(text, sender) {
        if (!chatMessagesContainer) return;

        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', sender);
        bubble.innerHTML = text.replace(/\n/g, '<br>');
        
        chatMessagesContainer.appendChild(bubble);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function simulateBotResponse(userMsgText) {
        const typingBubble = document.createElement('div');
        typingBubble.classList.add('chat-bubble', 'bot', 'typing-placeholder');
        typingBubble.textContent = "THINKING...";
        chatMessagesContainer.appendChild(typingBubble);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        const replyText = findMatch(userMsgText);

        setTimeout(() => {
            typingBubble.remove();
            appendMessage(replyText, 'bot');
        }, 800 + Math.random() * 600);
    }

    if (chatInputForm) {
        chatInputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInputEl.value.trim();
            if (!text) return;

            appendMessage(text, 'user');
            chatInputEl.value = '';

            simulateBotResponse(text);
        });
    }

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.textContent;
            appendMessage(query, 'user');
            simulateBotResponse(query);
        });
    });

    // ==========================================================================
    // 6. CONTACT FORM DISPATCHER
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formSuccessBox = document.getElementById('form-success-box');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.textContent = "TRANSMITTING DATA...";
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.style.display = 'none';
                if (formSuccessBox) {
                    formSuccessBox.style.display = 'block';
                    formSuccessBox.style.opacity = '0';
                    setTimeout(() => {
                        formSuccessBox.style.transition = 'opacity 0.5s';
                        formSuccessBox.style.opacity = '1';
                    }, 50);
                }
            }, 1200);
        });
    }
});
