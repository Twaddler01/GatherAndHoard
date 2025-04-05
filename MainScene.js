import Layout from './layout.js'; // Import the Layout class
import GatherBar from './gatherBar.js';  // Import the GatherBar class

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
        
        // Create and add the GatherBar content to the "Gather" tab
        //const gatherBar = new GatherBar(this, 'Twigs', 40, 100, 5); // Create a gather bar instance
        //layout.addContent('Gather', gatherBar); // Add the gather bar to the "Gather" tab
        
        /*let textTest = this.add.text(0, 0, 'testing 123...', {
            font: '20px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { left: 10, right: 10 }
        });
        layout.addContent('Gather', textTest);
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