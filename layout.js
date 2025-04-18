import GatherBar from './gatherBar.js';  // Import the GatherBar class

export default class Layout {
    constructor(scene) {
        this.scene = scene;
        this.tabsContainer = null;
        this.contentPages = {}; // Store content containers by tab labels
        this.tabHeight = 30; // Height of the tabs
        this.lineThickness = 2; // Thickness of the separator line
        this.tabYPosition = 0; // Y position of tabs
        this.contentBackground = null; // To hold the content background
    }

    createTabs() {
        this.tabsContainer = this.scene.add.container(0, this.tabYPosition);
        this.tabs = [];
    
        this.tabLabels = ['Gather', 'Craft', 'Upgrade'];
    
        let currentX = 0;
    
        this.tabLabels.forEach((label, index) => {
            // Measure text width by creating a temporary Text object
            const tempText = this.scene.add.text(0, 0, label, {
                font: '20px Arial'
            }).setVisible(false); // hide it
    
            const textWidth = tempText.width;
            const totalWidth = textWidth + 20; // 10px padding on each side
    
            tempText.destroy(); // cleanup
    
            this.createTab(label, currentX, 0, totalWidth);
            currentX += totalWidth;
        });
    
        this.createTabLine();
        //this.createContentBackground();
    
        this.tabLabels.forEach((label, index) => {
            this.createTabPage(label, 0, this.tabYPosition + this.tabHeight + this.lineThickness);
        });
    
        this.setActiveTab(0);
    }

    createTab(label, x, y, width) {
        const tabHeight = this.tabHeight;
    
        // Create background for tab
        const bg = this.scene.add.rectangle(
            x + width / 2,               // center X
            y + tabHeight / 2,           // center Y
            width,
            tabHeight,
            0x000000
        ).setInteractive();
    
        // Create the label text
        const text = this.scene.add.text(x + 10, y + (tabHeight / 2), label, {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0, 0.5); // center text vertically
    
        // Add interaction to background instead of just text
        bg.on('pointerdown', () => this.onTabClicked(label));
    
        // Add to tabsContainer
        this.tabsContainer.add(bg);
        this.tabsContainer.add(text);
        this.tabs.push({ bg, text }); // Save both bg and text for styling later
    }

    createTabLine() {
        // Create a simple line below the tabs to separate them from content
        const width = this.scene.sys.game.config.width;
        const line = this.scene.add.graphics();
        line.lineStyle(this.lineThickness, 0x808080); // Black line with thickness
        line.moveTo(0, this.tabYPosition + this.tabHeight);
        line.lineTo(width, this.tabYPosition + this.tabHeight);
        line.strokePath();
    }

    createContentBackground() {
        // Create a background rectangle for the content area
        const width = this.scene.sys.game.config.width;
        const height = this.scene.sys.game.config.height - (this.tabYPosition + this.tabHeight + this.lineThickness);
    
        // Calculate the Y position for content background
        const contentBackgroundY = this.tabYPosition + this.tabHeight + this.lineThickness;
    
        // Create a gray background covering the content area
        this.contentBackground = this.scene.add.graphics();
        this.contentBackground.fillStyle(0x333333, 1); // Gray color
        this.contentBackground.fillRect(0, contentBackgroundY, width, height);
    
        // Return the Y value for where the content background starts
        return contentBackgroundY;
    }

    createTabPage(label, x, y) {
        // Create a TabPage container to store all content for this tab
        const page = new TabPage(this.scene, x, y, this.scene.sys.game.config.width, this.scene.sys.game.config.height);
        this.contentPages[label] = page; // Store by tab label

        // Optionally: You can add default content to the tab here, e.g., text or buttons
        if (label === 'Gather') {
            //const gatherBar = new GatherBar(this.scene, 'Twigs', 40, 100, 5); // Example gather bar
            //page.addContent(gatherBar.container); // Add the gather bar to the "Gather" tab content
        }
        // Add content for other tabs as needed...
    }

    onTabClicked(tabLabel) {
        // Handle tab click and show corresponding content
        const index = this.tabLabels.indexOf(tabLabel);
        if (index !== -1) {
            this.setActiveTab(index);
        }
    }

    setActiveTab(index) {
        const selectedTabLabel = this.tabLabels[index];

        // Hide all content and show only the selected tab content
        Object.keys(this.contentPages).forEach((label) => {
            const page = this.contentPages[label];
            if (label === selectedTabLabel) {
                page.show(); // Show content for the selected tab
            } else {
                page.hide(); // Hide content for other tabs
            }
        });

        // Style the active tab (e.g., change color)
        this.tabs.forEach((tab, i) => {
            tab.text.setColor(i === index ? 'yellow' : '#ffffff');
            tab.bg.fillColor = i === index ? 0x444444 : 0x000000;
        });
    }

    addToTabPage(tabLabel, content) {
        const page = this.contentPages[tabLabel];
        if (!page) return;
    
        // Calculate next Y position based on existing content
        let nextY = 0;
        for (const obj of page.content) {
            if (obj.getBounds) {
                const bounds = obj.getBounds();
                const bottomY = obj.y + (bounds.height || 0);
                if (bottomY > nextY) nextY = bottomY + 10; // Add spacing
            }
        }
    
        // Safely set Y position
        if (typeof content.y === 'undefined') {
            content.y = nextY;
        }
    
        // Add to the container
        page.addContent(content);
    }
}

class TabPage {
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.container = this.scene.add.container(x, y);
        this.container.setSize(width, height);

        this.content = [];

        // Create a graphics mask to limit visible area
        const shape = this.scene.make.graphics({});
        shape.fillStyle(0xffff00);
        shape.fillRect(x, y, width, height);
        const mask = shape.createGeometryMask();
        this.container.setMask(mask);

    }

    // Bottom limit - the content can't scroll further than its height minus the container height
    minScrollY() {
        return this.scene.sys.game.config.height - this.container.height;
    }

    // Top limit - adjust this value to change how much content shows at the top
    maxScrollY() {
        return 0; // No content should scroll past the top
    }

    addContent(object) {
        this.container.add(object);
        this.content.push(object);
    }

    show() {
        this.container.setVisible(true);
    }

    hide() {
        this.container.setVisible(false);
    }

    clearContent() {
        this.container.removeAll();
        this.content = [];
    }
}