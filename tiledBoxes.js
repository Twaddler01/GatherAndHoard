import GatherBar from './gatherBar.js'; 
// For costs
import { gatherCounts } from './MainScene.js';

// Data array
export const tileData = [
    {
        title: 'Pebbles Upgrade',
        desc: 'Much larger than tiny pebbles.',
        available: true,
        requirements: [
            { id: 'Pebbles', count: 1000 }
        ]
    },
    {
        title: 'Rocks Upgrade',
        desc: 'Solid and heavy.',
        available: true,
        requirements: [
            { id: 'Rocks', count: 1000 },
            { id: 'Pebbles', count: 500 }
        ]
    },
    {
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        requirements: [
            { id: 'Twigs', count: 1000 }
        ]
    },
    // duplicates
        {
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        requirements: [
            { id: 'Twigs', count: 1000 }
        ]
    },
        {
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        requirements: [
            { id: 'Twigs', count: 1000 }
        ]
    },
        {
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        requirements: [
            { id: 'Twigs', count: 1000 }
        ]
    },
    {
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        requirements: [
            { id: 'Twigs', count: 1000 }
        ]
    }
];

// const tileBoxes = new TiledBoxes(this, 0, 0, tileData);

export default class TiledBoxes {
    constructor(scene, x, y, dataArray) {
        this.scene = scene;

// Stored output manipulation
this.tileButtons = {}; // Store buttons keyed by data id
this.tileColors = {};

        // Offset of each 'box'
        this.spacingX = 170; // boxWidth +10
        this.spacingY = 170; // boxHeight + 10

        this.container = scene.add.container();

        this.setupBoxes();

    }

    getTileButton(id) {
        return this.tileButtons[id];
    }

    getTileColor(id) {
        return this.tileColors[id];
    }

 setupBoxes() {
    this.container.removeAll(true); // clear and destroy existing buttons

    const availableWidth = this.scene.scale.width; // or a fixed width container if you're using one
    const boxWidth = 160;
    const spacing = 10;
    const totalBoxWidth = boxWidth + spacing;

    const maxCols = Math.floor((availableWidth - 20) / totalBoxWidth); // 20 is left margin
    let visibleIndex = 0;

    tileData.forEach((data) => {
        if (!data.available) return;

        const bg = this.scene.add.rectangle(-10, -10, boxWidth, boxWidth, 0x000000).setOrigin(0);

        const box = this.scene.add.container(0, 0);
        box.add(bg);

        const tileText = this.scene.add.text(0, 0, data.title, {
            font: '16px Arial',
            color: '#fff'
        });

        let costYOffset = 20;

        const tileBtn = this.scene.add.text(0, costYOffset, 'Action', {
            font: '20px Arial',
            backgroundColor: '#333',
            color: '#fff',
            padding: { x: 8, y: 4 }
        }).setInteractive()
            .on('pointerdown', () => {
                let canAfford = true;

                for (const req of data.requirements) {
                    const playerAmount = gatherCounts[req.id] || 0;
                    if (playerAmount < req.count) {
                        canAfford = false;
                        break;
                    }
                }

                if (canAfford) {
                    console.log('Performing action:', data.title);

                    for (const req of data.requirements) {
                        gatherCounts[req.id] -= req.count;
                    }

                    box.destroy();
                    this.removeBox(data);
                } else {
                    console.log('Not enough materials...');
                }
            });

        this.tileButtons[data.title] = tileBtn;

        const requiresText = this.scene.add.text(0, costYOffset + 30, '* Requires:', {
            font: '16px Arial',
            color: 'red'
        });

        let nextCostY = costYOffset + 50;
        const costTexts = [];

        data.requirements.forEach((req, i) => {
            const costText = this.scene.add.text(0, nextCostY, `${req.count} ${req.id}`, {
                font: '16px Arial',
                color: 'red'
            });

            this.tileColors[`${data.title}_cost_${i}`] = costText;
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
        box.y = 20 + row * (boxWidth + spacing);

        this.container.add(box);
        visibleIndex++;
    });
}

    
    removeBox(box) {
        box.available = false;
        this.setupBoxes();
    }
}