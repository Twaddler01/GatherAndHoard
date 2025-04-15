import Layout from './layout.js'; // Import the Layout class
import GatherBar from './gatherBar.js';  // Import the GatherBar class
import ScrollingBox from './scrollingBox.js';
import ShowUpgradeOpts from './showUpgradeOpts.js';
import TiledBoxes from './tiledBoxes.js';
import Inventory from './inventory.js';

export const gatherCounts = {};

export const upgradeData = [
    {
        req_id: 'Pebbles',
        req_cnt: 1000,
        from: 'Pebbles',
        to: 'Rocks',
        desc: 'Much larger than tiny pebbles.',
        available: true,
    },
    {
        req_id: 'Rocks',
        req_cnt: 1000,
        from: 'Rocks',
        to: 'Stones',
        desc: 'Solid and heavy.',
        available: true,
    },
    {
        req_id: 'Twigs',
        req_cnt: 1000,
        from: 'Twigs',
        to: 'Sticks',
        desc: 'More pokey.',
        available: true,
    },
];

upgradeData.forEach(upgrade => {
    upgrade.id = upgrade.from + '_to_' + upgrade.to;
});

const UI_STYLES = {
    // Box Colors
    topBoxColor: 0x2c3e50,
    mainBoxColor: 0x34495e,
    bottomBoxColor: 0x2c3e50,
    // Text Colors and Font Sizes
    textColor: "#ffffff",
    fontSizeLarge: "24px",
    fontSizeMedium: "20px",
    fontSizeSmall: "18px",
    // Button Color
    buttonColor: 0xe74c3c,
    // Optional: Background Color
    backgroundColor: 0x34495e,
};

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        // Globals
        //
    }

    preload() {
        this.load.image('upgradeIcon', 'assets/upgrade.png');
        //this.load.json('bibleVerses', 'assets/bibleVerses.json');
        //this.load.json('keyPassages', 'assets/keyPassages.json');
        //this.load.json('bibleBooks', 'assets/bibleBooks.json');
    }

    create() {
        //this.createUI();

        // Create layout
        const layout = new Layout(this);
        layout.createTabs();

        // Method for tab content Ypos
        //let yPos = layout.createContentBackground();
        //console.log(yPos);
        
        // GATHER
        //const textBox = this.add.text(5, 5, 'TITLE', {});
        //layout.addToTabPage('Gather', textBox);
        // Offset by 40 for text title above
        //this.scrollBox = new ScrollingBox(this, 0, 40, this.scale.width, this.scale.height, "", {

        this.scrollBox = new ScrollingBox(this, 0, 0, this.scale.width, this.scale.height, "", {
          bgColor: 0x000000,  // Dark gray background for testing
          fontFamily: 'Arial',
          fontSize: '18px',
          color: '#ffffff'
        });
        
        // WIP scrollBox needs to modify 'repeat' based on height of added objects
        //    const dummyText = "text text text\n".repeat(50); // Adjust repeat count for space
        
        // Add to entire tab + 40
        layout.addToTabPage('Gather', this.scrollBox.container);

        this.inventory = new Inventory(this, 0, 0);
        this.scrollBox.addElement(this.inventory.container, { startY: 10 });

        const up1_desc = 'Reduces gather points by 1.';
        // Next is added below other items
        this.gatherBar = new GatherBar(this, 'Pebbles', 40, 100, 5, up1_desc); // Set y=0 for stacking
        this.scrollBox.addElement(this.gatherBar.container);
        
        // Adds below gatherBar
        this.gatherBar2 = new GatherBar(this, 'Twigs', 40, 100, 5, up1_desc); // Set y=0 for stacking
        this.scrollBox.addElement(this.gatherBar2.container);
        
        this.gatherBar3 = new GatherBar(this, 'Leaves', 40, 100, 5, up1_desc); // Set y=0 for stacking
        this.scrollBox.addElement(this.gatherBar3.container);

        // Store references
        this.upgradeBars = {
            Pebbles: this.gatherBar,
            Twigs: this.gatherBar2,
            Leaves: this.gatherBar3,
        };

        // CRAFT
        this.craftScroll = new ScrollingBox(this, 0, 0, this.scale.width, this.scale.height, "", {
            bgColor: 0x000000,  // Dark gray background for testing
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff'
        });
        
        layout.addToTabPage('Craft', this.craftScroll.container);

        this.craftdBoxes = new TiledBoxes(this, 0, 0);
        this.craftScroll.addElement(this.craftdBoxes.container);



        // UPGRADE
        //this.upgrade = new ShowUpgradeOpts(this, 0, 0);
        //layout.addToTabPage('Upgrade', this.upgrade.container);

        this.upgradeScroll = new ScrollingBox(this, 0, 0, this.scale.width, this.scale.height, "", {
            bgColor: 0x000000,  // Dark gray background for testing
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff'
        });
        
        layout.addToTabPage('Upgrade', this.upgradeScroll.container);
        
        this.upgrade = new ShowUpgradeOpts(this, 0, 0);
        this.upgradeScroll.addElement(this.upgrade.container);

        // tests
        //const NEWgatherBar = new GatherBar(this, 'NEW TEST', 40, 100, 5); // Set y=0 for stacking
        //this.scrollBox.replaceElement(gatherBar2.container, NEWgatherBar.container);

        //this.scrollBox.removeElement(gatherBar2.container);
        
        //const textBox2 = this.add.text(5, 5, 'UPGRADE', {});
        //layout.addToTabPage('Upgrade', textBox2);
    }

    createUI() {
        // Setting up the main UI components

        const width = this.game.config.width;
        const height = this.game.config.height;

        // Game area rectangle
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x808080, 1); // Gray color
        this.graphics.fillRect(0, 0, width, height);
        this.graphics.setDepth(-1); // -1 ensures it's behind other game elements

    }
}
// Export default MainScene;
export default MainScene;