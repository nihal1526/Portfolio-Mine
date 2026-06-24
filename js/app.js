/**
 * Nihal S Jain - Portfolio Core Application Logic
 * Implements smooth IntersectionObserver-based scroll reveals, 
 * navigation tracking, menu toggling, contact form submissions, and the AI Chatbot.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Paste your Google Apps Script Web App URL or n8n Webhook URL here to capture real leads!
    const CONTACT_FORM_ENDPOINT = "https://portfolio1526.app.n8n.cloud/webhook/Portfolio";

    // Paste your n8n AI Agent Webhook URL here for dynamic chatbot responses!
    const CHATBOT_ENDPOINT = "https://nil1526.app.n8n.cloud/webhook/ai/agent/main";

    // Generate or retrieve a unique session ID for n8n AI Agent memory
    let chatSessionId = sessionStorage.getItem('portfolio_chat_session');
    if (!chatSessionId) {
        chatSessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('portfolio_chat_session', chatSessionId);
    }

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

    // Fallback response containing Nihal's phone number and email if connection is down
    const chatbotFallbackMsg = "I AM CURRENTLY UNABLE TO REACH MY COGNITIVE CORE. PLEASE SUBMIT AN INQUIRY IN THE 'REACH OUT' FORM OR CONTACT NIHAL DIRECTLY:\n\n📞 PHONE: +971 554491295\n📧 EMAIL: nihalsjain152002@gmail.com";

    function appendMessage(text, sender) {
        if (!chatMessagesContainer) return;

        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', sender);
        bubble.innerHTML = text.replace(/\n/g, '<br>');

        chatMessagesContainer.appendChild(bubble);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function simulateBotResponse(userMsgText) {
        console.log("🤖 Chatbot input received:", userMsgText);
        console.log("📤 Sending request to CHATBOT_ENDPOINT:", CHATBOT_ENDPOINT);

        const typingBubble = document.createElement('div');
        typingBubble.classList.add('chat-bubble', 'bot', 'typing-placeholder');
        typingBubble.textContent = "THINKING...";
        chatMessagesContainer.appendChild(typingBubble);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        if (CHATBOT_ENDPOINT) {
            fetch(CHATBOT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsgText,
                    chatInput: userMsgText,
                    sessionId: chatSessionId
                })
            })
                .then(res => {
                    console.log("📥 Received response status:", res.status);
                    if (!res.ok) throw new Error("HTTP error " + res.status);
                    return res.text();
                })
                .then(text => {
                    console.log("📥 Received response body length:", text.length);
                    let replyText = "";

                    if (text && text.trim() !== "") {
                        try {
                            let data = JSON.parse(text);

                            // Unpack array wrapper if returned from n8n
                            if (Array.isArray(data) && data.length > 0) {
                                data = data[0];
                            }

                            if (typeof data === 'string') {
                                replyText = data;
                            } else if (data && typeof data === 'object') {
                                // Extract common n8n AI agent reply fields dynamically
                                replyText = data.output || data.response || data.text || data.message || data.reply;
                                if (!replyText) {
                                    replyText = data.data?.output || data.data?.response || JSON.stringify(data);
                                }
                            }
                        } catch (jsonErr) {
                            // If it is not valid JSON, it might be plain text returned directly from n8n (e.g. OpenAI output as text).
                            // We use the text directly!
                            replyText = text;
                        }
                    }

                    typingBubble.remove();
                    appendMessage(replyText || chatbotFallbackMsg, 'bot');
                })
                .catch(err => {
                    console.error("n8n AI Agent connection failed:", err);
                    typingBubble.remove();
                    appendMessage(chatbotFallbackMsg, 'bot');
                });
        } else {
            setTimeout(() => {
                typingBubble.remove();
                appendMessage(chatbotFallbackMsg, 'bot');
            }, 1000);
        }
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

    function showSuccessUI() {
        if (contactForm) contactForm.style.display = 'none';
        if (formSuccessBox) {
            formSuccessBox.style.display = 'block';
            formSuccessBox.style.opacity = '0';
            setTimeout(() => {
                formSuccessBox.style.transition = 'opacity 0.5s';
                formSuccessBox.style.opacity = '1';
            }, 50);
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.textContent = "TRANSMITTING DATA...";
            submitBtn.disabled = true;

            const payload = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                message: document.getElementById('contact-message').value,
                timestamp: new Date().toISOString()
            };

            if (CONTACT_FORM_ENDPOINT) {
                const isGoogleScript = CONTACT_FORM_ENDPOINT.includes('/exec');

                let fetchOptions = {
                    method: 'POST',
                    mode: 'cors'
                };

                if (isGoogleScript) {
                    // Google Apps Script works best with URLSearchParams to prevent CORS issues
                    const params = new URLSearchParams();
                    params.append('name', payload.name);
                    params.append('email', payload.email);
                    params.append('message', payload.message);
                    params.append('timestamp', payload.timestamp);

                    fetchOptions.body = params;
                    fetchOptions.headers = {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                } else {
                    // Standard JSON POST for n8n/Make/Zapier webhooks
                    fetchOptions.body = JSON.stringify(payload);
                    fetchOptions.headers = {
                        'Content-Type': 'application/json'
                    };
                }

                fetch(CONTACT_FORM_ENDPOINT, fetchOptions)
                    .then(() => {
                        showSuccessUI();
                    })
                    .catch(err => {
                        console.error('Data dispatch failed:', err);
                        // Fallback to success UI so user is not blocked
                        showSuccessUI();
                    });
            } else {
                // Simulated transmission delay for local testing
                setTimeout(() => {
                    showSuccessUI();
                }, 1200);
            }
        });
    }
});
