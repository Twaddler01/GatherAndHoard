import GatherBar from './gatherBar.js'; 
import ScrollingBox from './scrollingBox.js';
import { gatherCounts, upgradeData, saveUpgradeBars } from './MainScene.js';

export default class ShowUpgradeOpts {
    constructor(scene, x, y) {
        this.scene = scene;
        this.upgradeButtons = {}; // Store buttons keyed by upgrade id
        this.upgradeColors = {};

        const baseX = 20;
        const baseY = 20;

        // Offset of each 'box'
        this.spacingX = 170; // boxWidth +10
        this.spacingY = 160; // boxHeight + 10

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
    
            const boxWidth = 160;
            const boxHeight = 150;
            
            const bg = this.scene.add.rectangle(-10, -20, boxWidth, boxHeight, 0x000000);
            bg.setOrigin(0); // Align to top-left corner
            
            const box = this.scene.add.container(0, -10);
            box.add(bg); // Add background first so it's behind other elements

            const arrowText = this.scene.add.text(0, -10, `${upgrade.from} -> ${upgrade.to}`, {
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
                
                    const newBar = new GatherBar(this.scene, upgrade.to, 40, 100, 5, this.scene.gatherBar.up1_desc); // new GatherBar
                    this.scene.upgradeBars[upgrade.to] = newBar;
                    this.scene.scrollBox.addElement(newBar.container);
                    saveUpgradeBars(this.scene);
                
                    gatherCounts[upgrade.req_id] -= upgrade.req_cnt;
                    
                    this.scene.inventory.updateInventory();
                    this.removeUpgrade(upgrade);
                    Object.values(this.scene.upgradeBars).forEach(bar => {
                        bar.upgradeIcon.destroy();
                        bar.showUpgrade();
                        bar.checkUpgradeAvailability();
                    });
                    console.log(this.scene.upgradeBars);
                } else {
                    console.log('Not enough materials...');
                }






/*
                if (playerAmount >= upgrade.req_cnt) {
            
                    console.log('Upgrading:' + upgrade.id);
                
                    const fromKey = upgrade.from;
                    const toKey = upgrade.to;
                
                
                    const fromBar = this.scene.upgradeBars[fromKey]; // GatherBar
                    const toBar = new GatherBar(this.scene, toKey, 40, 100, 5, this.scene.gatherBar.up1_desc); // new GatherBar
                
                    if (fromBar && toBar) {
                        this.scene.scrollBox.replaceElement(fromBar.container, toBar.container);
                
                        fromBar.destroy(); // Properly destroy old bar
                
                        // Update reference to full GatherBar instance
                        delete this.scene.upgradeBars[fromKey];
                        this.scene.upgradeBars[toKey] = toBar;
                
                        gatherCounts[upgrade.req_id] -= upgrade.req_cnt;
                        this.scene.inventory.updateInventory();
                
                        this.removeUpgrade(upgrade);
                    }
                } else {
                    console.log('Not enough materials...');
                }
*/
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

            box.x = 20 + col * this.spacingX;
            box.y = 20 + row * this.spacingY;
    
            this.container.add(box);
            visibleIndex++;
        });
    }
    
    removeUpgrade(upgrade) {
        upgrade.available = false;
        this.setupUpgrades();
    }
}