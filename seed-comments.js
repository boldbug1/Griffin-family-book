const Database = require('better-sqlite3');

const db = new Database('comments.db');

// Bot comments for each character
const botComments = {
    'peter-griffin': [
        { username: 'GriffinFan92', email: 'griffinfan92@gmail.com', text: "Peter's the funniest character! His random cutaway gags are legendary! 🍺" },
        { username: 'QuahogLocal', email: 'quahoglocal@gmail.com', text: "Can't believe he's survived all those injuries. The man is indestructible! 😂" },
        { username: 'FamilyGuyLover', email: 'familyguylover@gmail.com', text: '"Nyehehehehe" - that laugh is iconic! Best dad on TV (worst in real life though).' }
    ],
    'lois-griffin': [
        { username: 'LoisAppreciator', email: 'loisappreciator@gmail.com', text: 'Lois is the real MVP of the family. She puts up with so much! 💪' },
        { username: 'FamilyGuyFan', email: 'familyguyfan@gmail.com', text: "She's had so many careers - from flight attendant to boxer! What can't she do?" },
        { username: 'GriffinWatcher', email: 'griffinwatcher@gmail.com', text: "The way she handles Peter's antics is both impressive and concerning. True love right there! ❤️" }
    ],
    'stewie-griffin': [
        { username: 'StewieStan', email: 'stewiestan@gmail.com', text: 'A one-year-old with a British accent plotting world domination? Iconic! 🇬🇧' },
        { username: 'BrianAndStewie', email: 'brianandstewie@gmail.com', text: 'His friendship with Brian is the heart of the show. "Road to..." episodes are the best!' },
        { username: 'EvilGenius', email: 'evilgenius@gmail.com', text: '"Victory is mine!" - The most sophisticated baby in TV history. Love his character development!' }
    ],
    'meg-griffin': [
        { username: 'MegDefender', email: 'megdefender@gmail.com', text: 'Poor Meg! She deserves better. The family is way too harsh on her. 😢' },
        { username: 'UnderratedCharacter', email: 'underratedcharacter@gmail.com', text: 'Megatron is such a cool name though! She\'s had some great moments when she stands up for herself.' },
        { username: 'GriffinFamily', email: 'griffinfamily@gmail.com', text: 'The episode where she becomes popular was amazing! She\'s more resilient than people give her credit for. 💪' }
    ],
    'chris-griffin': [
        { username: 'ChrisFan', email: 'chrisfan@gmail.com', text: 'Chris is so sweet and innocent! His drawings are actually pretty good too! 🎨' },
        { username: 'EvilMonkey', email: 'evilmonkey@gmail.com', text: 'The evil monkey in his closet is one of the funniest running gags! Poor Chris! 😂' },
        { username: 'GriffinTeen', email: 'griffinteen@gmail.com', text: 'His logic is hilariously flawed but endearing. "That\'s worse than the time I..." moments are gold!' }
    ],
    'brian-griffin': [
        { username: 'BrianLover', email: 'brianlover@gmail.com', text: 'The most pretentious dog in TV history! His martini-drinking, novel-writing self is iconic! 🍸' },
        { username: 'StewieAndBrian', email: 'stewieandbrian@gmail.com', text: 'Best duo on the show! Their adventures together are always the highlight. The bromance is real!' },
        { username: 'IntellectualDog', email: 'intellectualdog@gmail.com', text: 'He\'s the voice of reason (when he\'s not being a hypocrite). Love his character arc! 🐕' }
    ]
};

// Seed function
function seedComments() {
    console.log('Seeding bot comments...');

    // First, create users if they don't exist
    const insertUser = db.prepare('INSERT OR IGNORE INTO users (username, email) VALUES (?, ?)');
    
    // Collect all unique users
    const allUsers = new Set();
    Object.values(botComments).forEach(comments => {
        comments.forEach(comment => {
            allUsers.add(JSON.stringify({ username: comment.username, email: comment.email }));
        });
    });

    // Insert users
    allUsers.forEach(userStr => {
        const user = JSON.parse(userStr);
        insertUser.run(user.username, user.email);
    });

    // Insert comments
    const insertComment = db.prepare(`
        INSERT OR IGNORE INTO comments (character_page, username, email, comment_text)
        VALUES (?, ?, ?, ?)
    `);

    let totalComments = 0;
    Object.entries(botComments).forEach(([characterPage, comments]) => {
        comments.forEach(comment => {
            try {
                insertComment.run(characterPage, comment.username, comment.email, comment.text);
                totalComments++;
            } catch (error) {
                console.error(`Error inserting comment for ${characterPage}:`, error);
            }
        });
    });

    console.log(`Successfully seeded ${totalComments} bot comments!`);
}

// Run seed
seedComments();
db.close();

