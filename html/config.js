const guidebookConfig = {
    defaultCategory: 'welcome.aboutUs', // Default open category
    defaultFont: 'Roboto', // Default font

    texts: {
        sidebarHeader: 'Categories',
        searchPlaceholder: 'Search...',
        uiSettings: 'UI Settings',
        uiSettingsDescription: 'Here you can customize the UI settings.',
        changeTextSize: 'Change Text Size:',
        searchBar: 'Search Bar:',
        selectFont: 'Select Font:',
        availableFonts: [
            'Roboto', 'Arial', 'Lato', 'Montserrat', 'Open Sans', 'Raleway', 'Poppins', 'Ubuntu', 'Merriweather', 'Oswald'
        ]
    },

    categories: {
        welcome: { // always unique
            title: 'Welcome',
            icon: 'fas fa-home',
            subcategories: {
                aboutUs: { // always unique
                    title: 'About Us',
                    icon: 'fas fa-info-circle',
                    content: `
                        <h3>Welcome 😊</h3>
                        <p>Welcome to our FiveM roleplay server! Here you will find everything you need to know about how to get involved and what to expect from our server.</p>
                        <h3>About the Server</h3>
                        <p>Our server offers a realistic and fun roleplay experience. Our goal is to provide players with an environment where they can create and share their stories.</p>
                        <h3>Guidebook</h3>
                        <p>This guidebook serves as a guide for both new and experienced players. You will find rules, tutorials, and other useful information here.</p>
                        <h3>Links</h3>

                        <p><a href="javascript:openExternalLink('https://sheenthebest.tebex.io')">🌐 Website</a></p>
                        <p><a>💬 discord.gg/YqMmT75hSu</a></p>
                        <p><strong>IP Address:</strong> 123.456.789.0</p>
                        <img src="https://wallpapers.com/images/hd/fivem-6q3bx9g2gdcu4th5.jpg" alt="" style="width:100%; height:auto;"/>
                    `
                },
                rules: { // always unique
                    title: 'Rules',
                    icon: 'fas fa-gavel',
                    content: `
                        <h3>Server Rules 📜</h3>
                        <ul>
                            <li>1. Respect other players and their stories.</li>
                            <li>2. No cheating or bug abuse.</li>
                            <li>3. No RDM (Random Deathmatch) or VDM (Vehicle Deathmatch).</li>
                            <li>4. Stick to roleplay rules and maintain regular presence.</li>
                            <li>5. Use appropriate language and behavior.</li>
                        </ul>
                        <img src="https://cdn.gracza.pl/i_gp/h/22/406629492.jpg" alt="" style="width:100%; height:auto;"/>
                    `
                },
                laws: { // always unique
                    title: 'City Laws',
                    icon: 'fas fa-balance-scale',
                    content: `
                        <h3>Regulations 🏛️</h3>
                        <ul>
                            <li>1. Obey speed limits and traffic regulations.</li>
                            <li>2. Do not cross on red lights.</li>
                            <li>3. Do not park in prohibited areas.</li>
                            <li>4. No use of illegal substances.</li>
                            <li>5. Only carry weapons with proper permits.</li>
                        </ul>
                    `
                },
            }
        },
        tutorials: { // always unique
            title: 'Tutorials',
            icon: 'fas fa-book',
            subcategories: {
                keybinds: { // always unique
                    title: '🎮 Keybinds',
                    icon: false,
                    content: `
                        <h3>Shortcuts</h3>
                        <p>Here are the main keybinds you will need:</p>
                        <ul>
                            <li><strong>F1:</strong> Open menu.</li>
                            <li><strong>F2:</strong> Open inventory.</li>
                            <li><strong>F3:</strong> Use action button.</li>
                            <li><strong>F5:</strong> Open phone.</li>
                        </ul>
                        <img src="https://forum.cfx.re/uploads/default/original/4X/9/2/b/92b43363cb1860942270ea6cacd6f92e89b3ac11.jpeg" alt="Keybinds" style="width:100%; height:auto;"/>
                    `
                },
                getJob: { // always unique
                    title: '👷‍♂️ How to Get a Job',
                    icon: false,
                    content: `
                        <h3>Job Application Process</h3>
                        <p>Follow these steps to get a job:</p>
                        <ol>
                            <li>Visit the job center.</li>
                            <li>Choose an available position.</li>
                            <li>Complete the application as instructed.</li>
                            <li>Wait for approval.</li>
                        </ol>
                        <img src="https://img.gta5-mods.com/q95/images/remastered-job-centre-fivem-add-on-sp/9bb32b-pic2.png" alt="" style="width:100%; height:auto;"/>
                    `
                },
                becomeCop: { // always unique
                    title: '🚔 How to Join a Police',
                    icon: false,
                    content: `
                        <h3>Police Recruitment</h3>
                        <p>Follow these steps to become a police officer:</p>
                        <ol>
                            <li>Visit the police station.</li>
                            <li>Talk to the recruitment officer.</li>
                            <li>Fill out the application and undergo an interview.</li>
                            <li>Successfully complete the training.</li>
                        </ol>
                        <img src="imgs/sh_wlp.png" alt="" style="width:100%; height:auto;"/>
                    `
                },
            }
        },
        vip: { // always unique
            title: 'VIP',
            icon: 'fas fa-crown',
            subcategories: {
                howToBuy: { // always unique
                    title: '💎 How to Purchase VIP',
                    icon: false,
                    content: `
                        <h3>VIP Purchase Guide</h3>
                        <p>To purchase VIP, follow these steps:</p>
                        <ol>
                            <li>Visit our website: <a href="javascript:openExternalLink('https://sheenthebest.tebex.io')">🌐 Website</a></li>
                            <li>Go to the "Store" section.</li>
                            <li>Select the VIP package you want to purchase.</li>
                            <li>Complete the payment process.</li>
                            <li>After payment, your VIP status will be activated automatically.</li>
                        </ol>
                    `
                },
                vipBenefits: { // always unique
                    title: '✨ VIP Benefits',
                    icon: false,
                    content: `
                        <h3>Exclusive VIP Benefits</h3>
                        <p>As a VIP member, you will enjoy the following benefits:</p>
                        <ul>
                            <li>Access to exclusive areas and features.</li>
                            <li>Priority queue during peak times.</li>
                            <li>Special VIP-only events and activities.</li>
                            <li>Enhanced in-game rewards and bonuses.</li>
                            <li>Unique VIP badge and recognition.</li>
                            <li>VIP Dealership Access</li>
                        </ul>
                        <img src="https://wallpapers.com/images/hd/fivem-zhg48vbp6zfjz15i.jpg" alt="" style="width:100%; height:auto;"/>
                    `
                },
            }
        },

        test: { // always unique
            title: 'Example',
            icon: 'fas fa-info-circle',
            content: `
                Example
            `
        },
    }
};
