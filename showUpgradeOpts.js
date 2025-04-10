import GatherBar from './gatherBar.js'; 
import ScrollingBox from './scrollingBox.js';
import { gatherCounts, upgradeData } from './MainScene.js';

export default class ShowUpgradeOpts {
    constructor(scene, x, y) {
        this.scene = scene;
        this.upgradeButtons = {}; // Store buttons keyed by upgrade id
        
        const spacing = 60;
        const baseX = 20;
        const baseY = 20;
        
        this.container = scene.add.container();

        upgradeData.forEach((upgrade, index) => {
            const box = scene.add.container(0, 0);
        
            const upgradeBtn = scene.add.text(0, 0, 'Upgrade', {
                font: '20px Arial',
                backgroundColor: '#333',
                color: '#fff',
                padding: { x: 8, y: 4 }
            }).setInteractive()
            .on('pointerdown', () => {
                console.log('Upgrading:' + upgrade.id);

                const fromKey = upgrade.from; // e.g., "Pebbles"
                const toKey = upgrade.to;     // e.g., "Rocks"
            
                const fromBar = this.scene.upgradeBars[fromKey];
                const toBar = new GatherBar(this.scene, toKey, 40, 100, 5);
            
                if (fromBar && toBar) {
                    this.scene.scrollBox.replaceElement(fromBar, toBar.container);
 
                    // Optionally, remove the old reference from the object
                    delete this.scene.upgradeBars[fromKey];

                    // Optional: update new stored reference
                    this.scene.upgradeBars[toKey] = toBar.container;

                } else {
                    console.warn('Missing bar for upgrade:' + fromKey, '->' + toKey);
                }
            });

            // Store this button with its unique id
            this.upgradeButtons[upgrade.id] = upgradeBtn;

            const requiresText = scene.add.text(0, 30, '* Requires:', {
                font: '16px Arial',
                color: '#ccc'
            });
        
            const costText = scene.add.text(0, 50, `${upgrade.req_cnt} ${upgrade.req_id}`, {
                font: '16px Arial',
                color: '#fff'
            });
        
            const arrowText = scene.add.text(0, 70, `${upgrade.from} -> ${upgrade.to}`, {
                font: '16px Arial',
                color: '#fff'
            });
        
            const descText = scene.add.text(0, 90, upgrade.desc, {
                font: '14px Arial',
                color: '#aaa',
                wordWrap: { width: 140 }
            });
        
            box.add([upgradeBtn, requiresText, costText, arrowText, descText]);
        
            box.x = baseX + index * (120 + spacing);
            box.y = baseY;
        
            this.container.add(box);
        });
    }
    
    getUpgradeButton(id) {
        return this.upgradeButtons[id];
    }
}