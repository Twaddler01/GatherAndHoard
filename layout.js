import GatherBar from './gatherBar.js';  // Import the GatherBar class

export default class Layout {
    constructor(scene) {
        this.scene = scene;
        this.tabsContainer = null;
        this.contentPages = {}; // Store content containers by tab labels
        this.tabHeight = 40; // Height of the tabs
        this.lineThickness = 2; // Thickness of the separator line
        this.tabYPosition = 0; // Y position of tabs
        this.contentBackground = null; // To hold the content background
    }

    createTabs() {
        // Create tabs container
        this.tabsContainer = this.scene.add.container(0, this.tabYPosition);

        // Create the tabs (you can add more as needed)
        this.createTab('Gather', 0, 0);
        this.createTab('Tab 2', 80, 0);
        this.createTab('Tab 3', 160, 0);

        // Draw a line below the tabs to separate them from the content
        this.createTabLine();

        // Create a background rectangle for the content area
        this.createContentBackground();

        // Create the content containers for each tab
        this.createTabPage('Gather', 0, this.tabYPosition + this.tabHeight + this.lineThickness);
        this.createTabPage('Tab 2', 0, this.tabYPosition + this.tabHeight + this.lineThickness);
        this.createTabPage('Tab 3', 0, this.tabYPosition + this.tabHeight + this.lineThickness);

        // Set Tab 1 as the active tab initially
        this.setActiveTab(0);
    }

    createTab(label, x, y) {
        // Create a tab button (basic text-based for now)
        const tab = this.scene.add.text(x, y, label, {
            font: '20px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { left: 10, right: 10 }
        })
        .setInteractive()
        .on('pointerdown', () => this.onTabClicked(label));

        this.tabsContainer.add(tab);
    }

    createTabLine() {
        // Create a simple line below the tabs to separate them from content
        const width = this.scene.sys.game.config.width;
        const line = this.scene.add.graphics();
        line.lineStyle(this.lineThickness, 0x000000); // Black line with thickness
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
    this.contentBackground.fillStyle(0x808080, 1); // Gray color
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
        const index = ['Gather', 'Tab 2', 'Tab 3'].indexOf(tabLabel);
        if (index !== -1) {
            this.setActiveTab(index);
        }
    }

    setActiveTab(index) {
        const tabLabels = ['Gather', 'Tab 2', 'Tab 3'];
        const selectedTabLabel = tabLabels[index];

        // Hide all content and show only the selected tab content
        Object.keys(this.contentPages).forEach((label) => {
            const page = this.contentPages[label];
            if (label === selectedTabLabel) {
                page.show(); // Show content for the selected tab
            } else {
                page.hide(); // Hide content for other tabs
            }
        });

        // Optionally: Style the active tab (e.g., change color)
        this.tabsContainer.list.forEach((tab, i) => {
            tab.setStyle({
                font: '20px Arial',
                fill: i === index ? 'yellow' : '#ffffff',
                backgroundColor: i === index ? '#444444' : '#000000'
            });
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
/*
        // Enable dragging for scrolling
        this.isDragging = false;
        this.startY = 0;
        this.startScrollY = 0;

        // Listen for pointer events for dragging
        this.scene.input.on('pointerdown', (pointer) => {
            // Only start dragging if the pointer is inside the visible content area
            if (this.container.visible && this.container.getBounds().contains(pointer.x, pointer.y)) {
                this.isDragging = true;
                this.startY = pointer.y;
                this.startScrollY = this.container.y;
            }
        });

        this.scene.input.on('pointerup', () => {
            this.isDragging = false;
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                const delta = pointer.y - this.startY;
                // Move container but clamp its position to avoid scrolling past the top or bottom
                this.container.y = Phaser.Math.Clamp(this.startScrollY + delta, this.minScrollY(), this.maxScrollY());
            }
        });*/
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