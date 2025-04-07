import Layout from './layout.js'; // Import the Layout class
import GatherBar from './gatherBar.js';  // Import the GatherBar class
import ScrollingBox from './scrollingBox.js';

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
        this.createUI();
        //this.add.text(10, 10, "Scene Loaded", { color: "#fff" });
        
        // Create layout
        const layout = new Layout(this);
        layout.createTabs();

// Method for tab content Ypos
//let yPos = layout.createContentBackground();
//console.log(yPos);

const scrollBox = new ScrollingBox(this, 0, 0, this.scale.width, this.scale.height, "Initial text test123", {
  bgColor: 0x0000ff,  // Blue background for testing
  fontFamily: 'Arial',
  fontSize: '18px',
  color: '#ffffff'
});


layout.addToTabPage('Gather', scrollBox.container);


//const gatherBar = new GatherBar(this, 'Pebbles', 40, 100, 5); // Set y=0 for stacking
//box.addElement(gatherBar.container);



/* const gatherBar2 = new GatherBar(this, 'Grass', 40, 0, 5); // Set y=0 for stacking
layout.addToTabPage('Gather', gatherBar2.container);
const gatherBar3 = new GatherBar(this, 'Sticks', 40, 0, 5); // Set y=0 for stacking
layout.addToTabPage('Gather', gatherBar3.container);
const gatherBar4 = new GatherBar(this, 'Stones', 40, 0, 5); // Set y=0 for stacking
layout.addToTabPage('Gather', gatherBar4.container);
const gatherBar5 = new GatherBar(this, 'Brush', 40, 0, 5); // Set y=0 for stacking
layout.addToTabPage('Gather', gatherBar5.container);
const gatherBar6 = new GatherBar(this, 'Reeds', 40, 0, 5); // Set y=0 for stacking
layout.addToTabPage('Gather', gatherBar6.container);
const gatherBar7 = new GatherBar(this, 'Cattails', 40, 0, 5); // Set y=0 for stacking
layout.addToTabPage('Gather', gatherBar7.container);
*/
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