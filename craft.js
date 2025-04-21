import GatherBar from './gatherBar.js';
import CraftStorage from './classes/CraftStorage.js';
import { gatherCounts } from './MainScene.js';

export const craftData = [
    {
        num: 1,
        id: 'craftAltar1',
        title: 'Primitive Altar',
        desc: 'Altars grant the ability to gain knowledge for research and advancement.',
        //available: true,
        canBuy: false,
        max: 1,
        requirements: [
            { id: 'Pebbles', count: 1 },
        ],
        effect: [
            { id: '_autoKnowledge', amt: 0, text: '+1 Knowledge/s' }
        ],
    },
    {
        num: 2,
        id: 'craftShelter1',
        title: 'Primitive Shelter',
        desc: 'A place for security and rest.',
        //available: true,
        canBuy: false,
        max: 5,
        requirements: [
            { id: 'Rocks', count: 3 },
            { id: 'Pebbles', count: 5 },
            { id: 'Sticks', count: 3 },
        ],
        effect: [
            { id: '_addCitizen', amt: 0, text: '+1 Citizen' }
        ],
    },
    {
        num: 3,
        id: 'craftStorage1',
        title: 'Storage Hole',
        desc: 'A place to put things.',
        //available: true,
        canBuy: false,
        max: 5,
        requirements: [
            { id: 'Twigs', count: 5 }
        ],
        effect: [
            { id: '_addStorage', amt: 0, text: 'Increases storage capacity by 2000.' }
        ],
    },
    // duplicates
    {
        num: 4,
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        //available: true,
        canBuy: false,
        requirements: [
            { id: 'Twigs', count: 5 }
        ]
    },
    {
        num: 5,
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        //available: true,
        canBuy: false,
        requirements: [
            { id: 'Twigs', count: 5 }
        ]
    },
    {
        num: 6,
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        //available: true,
        canBuy: false,
        requirements: [
            { id: 'Twigs', count: 5 }
        ]
    },
    {
        num: 7,
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        //available: true,
        canBuy: false,
        requirements: [
            { id: 'Twigs', count: 5 }
        ]
    }
];

export default class Craft {
    constructor(scene, x, y) {
        this.scene = scene;

        // Stored output manipulation
        this.tileButtons = {}; // Store buttons keyed by data id
        this.tileColor = {};
        this.tileColorCnt = {};
        
        this.upgradeStore = {};

        // Offset of each 'box'
        this.spacingX = 170; // boxWidth +10
        this.spacingY = 170; // boxHeight + 10

        //this.inventoryContainer = scene.add.container(x, y);
        this.container = scene.add.container(x, y);

        this.setupStorage();
        this.setupBoxes();

/* DEBUG
const activeUpgrades = this.craftStore.getActiveUpgrades(craftData);
activeUpgrades.forEach(upg => {
    console.log(`${upg.title} is active at level ${upg.amt}`);
});
*/

    }

    getTileButton(id) {
        return this.tileButtons[id];
    }

    getTileColor(id) {
        return this.tileColor[id];
    }
    
    setupStorage() {
        this.craftStore = new CraftStorage();
    
        const loaded = Object.keys(this.craftStore.getAll()).length > 0;
    
        // If there is no saved data, create new entries based on craftData
        if (!loaded) {
            craftData.forEach(data => {
                if (data.effect) {
                    this.craftStore.setUpgrade(data.num, 0); // initial amt
                }
            });
            this.craftStore.save(); // Save initial state
        } else {
            // Load values from storage into craftData
            craftData.forEach(data => {
                if (this.craftStore.hasUpgrade(data.num)) {
                    const amt = this.craftStore.getUpgrade(data.num);
                    if (data.effect) {
                        data.effect.forEach(eff => {
                            eff.amt = amt;
                        });
                    }
                }
            });
        }
    }

    setupBoxes() {
        this.container.removeAll(true); // clear and destroy existing buttons

        const availableWidth = this.scene.scale.width; // or a fixed width container if you're using one
        const boxWidth = 160;
        const addedBoxHeight = 30; // Extra height above square (boxWidth)
        const spacing = 10;
        const totalBoxWidth = boxWidth + spacing;
    
        const maxCols = Math.floor((availableWidth - 20) / totalBoxWidth); // 20 is left margin
        let visibleIndex = 0;
    
        craftData.forEach((data) => {
            if (this.craftStore.isHidden(data.num, data.max)) return;

            const bg = this.scene.add.rectangle(-10, -20, boxWidth, boxWidth + addedBoxHeight, 0x000000).setOrigin(0);
    
            const box = this.scene.add.container(0, -10);
            box.add(bg);
    
            const tileText = this.scene.add.text(0, -10, data.title, {
                font: '16px Arial',
                color: '#fff'
            });
    
            let costYOffset = 20;
    
            const tileBtn = this.scene.add.text(0, costYOffset, 'Craft', {
                font: '20px Arial',
                backgroundColor: '#333',
                color: '#fff',
                padding: { x: 8, y: 4 },
            }).setInteractive();
    
            tileBtn.on('pointerdown', function () {
                if (data.canBuy) {
                    data.requirements.forEach((req, i) => {
                        if (gatherCounts[req.id] >= req.count) {
                            console.log('Action ready...');
                            // Action
                            gatherCounts[req.id] -= req.count;
                            // Storage
                            if (data.effect) {
                                data.effect.forEach(effect => {
                                    effect.amt += 1;
                                    this.craftStore.setUpgrade(data.num, effect.amt);
                                });
                            }
                            box.destroy();
                            this.setupBoxes();
                            this.scene.inventory.updateInventory();
                            Object.values(this.scene.upgradeBars).forEach(bar => {
                                bar.checkUpgradeAvailability();
                            });
                            this.scene.craftedItemsDisplay.updateCraftedItems();
                        }
                    });
                } else {
                    console.log('Not enough materials...');
                }
            }, this);
    
            this.tileButtons[data.title] = tileBtn;
    
            const requiresText = this.scene.add.text(0, costYOffset + 30, '* Requires:', {
                font: '16px Arial',
                color: 'red'
            });
            
            this.tileColor[data.title + '_lbl'] = requiresText;
    
            let nextCostY = costYOffset + 50;
            const costTexts = [];
    
            data.requirements.forEach((req, i) => {
                const costText = this.scene.add.text(0, nextCostY, `${req.count} ${req.id}`, {
                    font: '16px Arial',
                    color: 'red'
                });
    
                this.tileColor[req.id + '_req_' + i] = costText;
                this.tileColor[req.id + '_cost_' + i] = req.count;
                costTexts.push(costText);
    
                nextCostY += 20;
            });
    
            const descText = this.scene.add.text(0, nextCostY + 10, data.desc, {
                font: '14px Arial',
                color: '#aaa',
                wordWrap: { width: 140 }
            });
    
            box.add([tileText, tileBtn, requiresText, descText, ...costTexts]);
    
            const col = visibleIndex % maxCols;
            const row = Math.floor(visibleIndex / maxCols);
    
            box.x = 20 + col * totalBoxWidth;
            box.y = 20 + row * (boxWidth + addedBoxHeight + spacing);
    
            this.container.add(box);
            visibleIndex++;
        });
        
        //this.scene.craftedItemsDisplay.updateCraftedItems();
    }

    removeBox(box) {
        //box.available = false;
        this.setupBoxes();
    }
}