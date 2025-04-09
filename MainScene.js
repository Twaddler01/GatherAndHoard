import Layout from './layout.js'; // Import the Layout class
import GatherBar from './gatherBar.js';  // Import the GatherBar class
import ScrollingBox from './scrollingBox.js';

export const gatherCounts = {};

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

const textBox = this.add.text(5, 5, 'TITLE', {});
layout.addToTabPage('Gather', textBox);

// Offset by 40 for text title above
const scrollBox = new ScrollingBox(this, 0, 40, this.scale.width, this.scale.height, "", {
  bgColor: 0x000000,  // Dark gray background for testing
  fontFamily: 'Arial',
  fontSize: '18px',
  color: '#ffffff'
});

// WIP scrollBox needs to modify 'repeat' based on height of added objects
//    const dummyText = "text text text\n".repeat(50); // Adjust repeat count for space

// Add to entire tab + 40
layout.addToTabPage('Gather', scrollBox.container);

// Next is added below other items
const gatherBar = new GatherBar(this, 'Pebbles', 40, 100, 5); // Set y=0 for stacking
scrollBox.addElement(gatherBar.container);

// Adds below gatherBar
const gatherBar2 = new GatherBar(this, 'Grass', 40, 100, 5); // Set y=0 for stacking
scrollBox.addElement(gatherBar2.container);

const textBox2 = this.add.text(5, 5, 'UPGRADE', {});
layout.addToTabPage('Upgrade', textBox2);





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