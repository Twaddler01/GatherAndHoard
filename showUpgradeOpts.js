import GatherBar from './gatherBar.js'; 
import ScrollingBox from './scrollingBox.js';
import { gatherCounts, upgradeData } from './MainScene.js';

export default class ShowUpgradeOpts {
    constructor(scene, x, y) {
        this.scene = scene;
        this.upgradeButtons = {}; // Store buttons keyed by upgrade id
        this.upgradeColors = {};

        const spacing = 60;
        const baseX = 20;
        const baseY = 20;
        
        this.container = scene.add.container();

        this.setupUpgrades();

    }

    getUpgradeButton(id) {
        return this.upgradeButtons[id];
    }

    getUpgradeText(id) {
        return this.upgradeColors[id];
    }

    setupUpgrades() {
        this.container.removeAll(true); // clear and destroy existing buttons
    
        let visibleIndex = 0;
    
        upgradeData.forEach((upgrade) => {
            if (!upgrade.available) return;
    
const boxWidth = 150 + 10;
const boxHeight = 120 + 20;

const bg = this.scene.add.rectangle(-10, -10, boxWidth, boxHeight, 0x000000);
bg.setOrigin(0); // Align to top-left corner

const box = this.scene.add.container(0, 0);
box.add(bg); // Add background first so it's behind other elements

            const arrowText = this.scene.add.text(0, 0, `${upgrade.from} -> ${upgrade.to}`, {
                font: '16px Arial',
                color: '#fff'
            });

            const upgradeBtn = this.scene.add.text(0, 20, 'Upgrade', {
                font: '20px Arial',
                backgroundColor: '#333',
                color: '#fff',
                padding: { x: 8, y: 4 }
            }).setInteractive()
.on('pointerdown', () => {
    
    // Check required resource cnt
    const playerAmount = gatherCounts[upgrade.req_id] || 0;
    
    if (playerAmount >= upgrade.req_cnt) {

        console.log('Upgrading:' + upgrade.id);
    
        const fromKey = upgrade.from;
        const toKey = upgrade.to;
    
    
        const fromBar = this.scene.upgradeBars[fromKey]; // GatherBar
        const toBar = new GatherBar(this.scene, toKey, 40, 100, 5); // new GatherBar
    
        if (fromBar && toBar) {
            this.scene.scrollBox.replaceElement(fromBar.container, toBar.container);
    
            fromBar.destroy(); // Properly destroy old bar
    
            // Update reference to full GatherBar instance
            delete this.scene.upgradeBars[fromKey];
            this.scene.upgradeBars[toKey] = toBar;
    
            gatherCounts[upgrade.req_id] -= upgrade.req_cnt;
    
            this.removeUpgrade(upgrade);
        }
    } else {
        console.log('Not enough materials...');
    }
});

    
            this.upgradeButtons[upgrade.id] = upgradeBtn;
    
            const requiresText = this.scene.add.text(0, 50, '* Requires:', {
                font: '16px Arial',
                color: 'red'
            });
    
            const costText = this.scene.add.text(0, 70, `${upgrade.req_cnt} ${upgrade.req_id}`, {
                font: '16px Arial',
                color: 'red'
            });

            this.upgradeColors[upgrade.id + '_req'] = requiresText;
            this.upgradeColors[upgrade.id + '_cost'] = costText;

            const descText = this.scene.add.text(0, 90, upgrade.desc, {
                font: '14px Arial',
                color: '#aaa',
                wordWrap: { width: 140 }
            });
    
            box.add([upgradeBtn, requiresText, costText, arrowText, descText]);
    
            const col = visibleIndex % 2;
            const row = Math.floor(visibleIndex / 2);
    
            const spacingX = 180;
            const spacingY = 160;
    
            box.x = 20 + col * spacingX;
            box.y = 20 + row * spacingY;
    
            this.container.add(box);
            visibleIndex++;
        });
    }
    
    removeUpgrade(upgrade) {
        upgrade.available = false;
        this.setupUpgrades();
    }
}

function createPaddedContainer(scene, x, y, width, height, padding, centerItems = false) {
    // Create the background rectangle with padding
    const bg = scene.add.rectangle(x, y, width + padding * 2, height + padding * 2, 0x000000);
    bg.setOrigin(0, 0);  // Set the origin to the top-left corner

    const container = scene.add.container(x, y);
    container.add(bg);

    let currentY = padding;  // Initial y position (padding applied)

    // Helper function to add item to container
    function addItem(item) {
        if (centerItems) {
            // Center the item horizontally within the container
            item.setX(container.x + (container.width - item.width) / 2);
        } else {
            // Align item to the left with padding
            item.setX(container.x + padding);
        }

        item.setY(container.y + currentY);  // Set the y position
        container.add(item);

        // Update the currentY for next item
        currentY += item.height + padding;  // Space out items by the padding
    }

    return {
        container,
        addItem,
    };
}