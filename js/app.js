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
        about: { title: 'ABOUT', desc: 'Background, Core Skills, and Adaptability.' },
        services: { title: 'SERVICES', desc: 'n8n, Make, Vector Search, AI agents.' },
        projects: { title: 'PROJECTS', desc: 'Transaction monitors, WhatsApp bots, RAG pipelines.' },
        contact: { title: 'CONTACT', desc: 'Instant AI reply or Direct form dispatch.' }
    };

    // --- Observer A: Scroll reveals on text elements ---
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            } else {
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
        rootMargin: "-25% 0px -35% 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateLateralNav(entry.target.id);
            }
        });
    }, sectionOptions); // Fixed syntax error: replaced 'sectionObserverOptions = sectionOptions' with 'sectionOptions'

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
    // 5. CHATBOT BOT CONVERSATION ENGINE (DICTIONARY KNOWLEDGE BASE)
    // ==========================================================================
    const chatMessagesContainer = document.getElementById('chatbot-messages');
    const chatInputForm = document.getElementById('chatbot-input-form');
    const chatInputEl = document.getElementById('chatbot-user-msg');
    const suggestionBtns = document.querySelectorAll('.suggest-btn');

    // Structured Knowledge base containing Nihal S Jain's resume details
    const botKnowledge = {
        about: {
            keywords: ['who', 'you', 'nihal', 'about', 'summary', 'introduce', 'profile', 'engineer', 'developer', 'automation'],
            response: "NIHAL S JAIN IS AN AI AUTOMATION ENGINEER WITH 1+ YEAR OF EXPERIENCE IN WORKFLOW AUTOMATION, AI CHATBOT DEVELOPMENT, AND PROCESS OPTIMIZATION USING n8n, MAKE (INTEGROMAT), AND ZAPIER. HE IS HIGHLY SKILLED IN BUILDING AI AGENTS, RAG-BASED KNOWLEDGE SYSTEMS, AND BUSINESS WORKFLOWS."
        },
        experience: {
            keywords: ['experience', 'work', 'job', 'company', 'arn', 'innovations', 'career', 'employment', 'present'],
            response: "NIHAL WORKED AS AN IT SUPPORT & AI AUTOMATION EXECUTIVE AT ARN INNOVATIONS TECHNOLOGY LLC IN DUBAI, UAE (2025 - PRESENT).\n\nHE CONTRIBUTED BY:\n- DESIGNING AI AGENTS WITH n8n, INTEGRATING OPENAI MODELS & MONGODB STORAGE.\n- BUILDING RAG (RETRIEVAL-AUGMENTED GENERATION) SYSTEMS USING MONGODB ATLAS VECTOR SEARCH.\n- DEPLOYING AUTOMATION WORKFLOWS REDUCING MANUAL DATA ENTRY AND CAPTURING LEADS.\n- DEVELOPING MESSAGING CHATBOTS ON TELEGRAM AND WHATSAPP."
        },
        projects: {
            keywords: ['projects', 'project', 'portfolio', 'build', 'made', 'wallet', 'whatsapp', 'pdf', 'messenger', 'tracker'],
            response: "NIHAL'S CORE COMPLETED PROJECTS INCLUDE:\n\n1. AI-WEBCHAT-ASSISTANT: n8n ASSISTANT SUPPORTED BY MONGODB CHAT MEMORY AND WEBHOOK INTEGERS.\n2. TRON-WALLET-TRACKER: TRC20 TRANSACTION ALERT MONITOR DEPLOYED ON n8n.\n3. WHATSAPP-AI-AUTO-REPLY: META WHATSAPP BUSINESS CONNECTED WITH GOOGLE GEMINI MODELS.\n4. PDF-READER: AUTOMATED PDF VECTOR EMBEDDING PIPELINE FOR DOC QUERYING.\n5. MESSENGER-AUTOMATION: META MESSENGER TO GOOGLE SHEETS PIPELINE.\n6. RAG AI AGENT: SECURE ATLAS VECTOR SEARCH KNOWLEDGE PIPELINE."
        },
        skills: {
            keywords: ['skills', 'skill', 'tools', 'languages', 'python', 'programming', 'database', 'mongodb', 'n8n', 'make', 'zapier'],
            response: "NIHAL'S DETAILED SKILLS:\n\n- AUTOMATION: n8n, MAKE (INTEGROMAT), ZAPIER, REST APIs, WEBHOOKS, JSON.\n- PROGRAMMING/AI: PYTHON, PYTORCH, TENSORFLOW, OPENCV, PANDAS.\n- DATABASES: SQL, MONGODB ATLAS VECTOR SEARCH, MS EXCEL.\n- WEB & DESIGN: HTML, CSS, CANVA.\n- SUPPORT: SYSTEM TROUBLESHOOTING, DOCUMENTATION, PROCESS OPTIMIZATION."
        },
        education: {
            keywords: ['education', 'degree', 'study', 'college', 'university', 'srinivas', 'mangaluru', 'aiml'],
            response: "NIHAL HOLDS A BACHELOR OF ENGINEERING (B.E.) DEGREE IN ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING FROM SRINIVAS INSTITUTE OF TECHNOLOGY, MANGALURU."
        },
        certifications: {
            keywords: ['certifications', 'certification', 'courses', 'course', 'google', 'microsoft', 'power', 'credentials'],
            response: "NIHAL'S CERTIFICATIONS & COURSES:\n\n- INFORMATION TECHNOLOGY SPECIALIST - ARTIFICIAL INTELLIGENCE CERTIFICATION.\n- FROM DATA TO INSIGHTS WITH GOOGLE CLOUD.\n- MICROSOFT CERTIFIED: POWER PLATFORM FUNDAMENTALS."
        },
        interests: {
            keywords: ['interests', 'interests', 'hobbies', 'hobby', 'leisure', 'sports', 'gaming'],
            response: "NIHAL'S INTERESTS & HOBBIES INVOLVE:\n\n- PHOTOGRAPHY, TRAVELING, VOLUNTEERING, GAMING, SPORTS, AND CONTINUOUSLY LEARNING NEW SKILLS."
        },
        languages: {
            keywords: ['languages', 'speak', 'talk', 'write', 'english', 'hindi', 'kannada'],
            response: "NIHAL IS FLUENT IN: ENGLISH, HINDI, AND KANNADA."
        }
    };

    // Fallback response containing Nihal's phone number and email
    const fallbackResponse = "I COULD NOT MATCH YOUR QUERY TO A SPECIFIC RESUME TOPIC. YOU CAN DISPATCH AN EMAIL OR REACH OUT TO NIHAL DIRECTLY FOR DISCUSSIONS:\n\n📞 PHONE: +971 554491295\n📧 EMAIL: nihalsjain152002@gmail.com\n📍 LOCATION: BURJUMAN, DUBAI, UAE";

    function findMatch(userInput) {
        const inputLower = userInput.toLowerCase().trim();
        
        // Remove punctuation to clean matching
        const words = inputLower.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").split(/\s+/);
        
        let bestCategory = null;
        let highestScore = 0;
        
        // Score each category based on matching keywords
        for (const category in botKnowledge) {
            let score = 0;
            const keywords = botKnowledge[category].keywords;
            
            words.forEach(word => {
                // Direct word matching or substring matching
                if (keywords.includes(word)) {
                    score += 3; // exact match gets higher weight
                } else {
                    keywords.forEach(kw => {
                        if (word.length > 3 && kw.includes(word)) {
                            score += 1;
                        }
                    });
                }
            });
            
            if (score > highestScore) {
                highestScore = score;
                bestCategory = category;
            }
        }
        
        if (highestScore > 0 && bestCategory) {
            return botKnowledge[bestCategory].response;
        }
        
        return fallbackResponse;
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
