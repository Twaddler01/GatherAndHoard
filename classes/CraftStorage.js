export default class CraftStorage {
    constructor(storageKey = 'craft_data') {
        this.storageKey = storageKey;
        this.prefix = 'a'; // Can be changed for versioning
        this.upgrades = this.load();
    }

    encodeID(id) {
        return id.toString(36);
    }

    encodeValue(val) {
        return val.toString(36).padStart(2, '0'); // Always 2 chars
    }

    decodeID(str) {
        return parseInt(str, 36);
    }

    decodeValue(str) {
        return parseInt(str, 36);
    }

    load() {
        const str = localStorage.getItem(this.storageKey);
        if (!str || !str.startsWith(this.prefix)) return {};

        const upgrades = {};
        const raw = str.slice(1); // remove prefix

        for (let i = 0; i < raw.length; i += 3) {
            const id = this.decodeID(raw[i]);
            const val = this.decodeValue(raw.slice(i + 1, i + 3));
            upgrades[id] = val;
        }

        return upgrades;
    }

    save() {
        let encoded = this.prefix;
        for (const id in this.upgrades) {
            const idChar = this.encodeID(id);
            const valChars = this.encodeValue(this.upgrades[id]);
            encoded += idChar + valChars;
        }
        localStorage.setItem(this.storageKey, encoded);
    }

    setUpgrade(id, value) {
        this.upgrades[id] = value;
        this.save();
    }

    getUpgrade(id) {
        return this.upgrades[id] ?? null;
    }

    hasUpgrade(id) {
        return this.upgrades.hasOwnProperty(id);
    }

    removeUpgrade(id) {
        if (this.hasUpgrade(id)) {
            delete this.upgrades[id];
            this.save();
        }
    }

    clear() {
        this.upgrades = {};
        localStorage.removeItem(this.storageKey);
    }

    getAll() {
        return { ...this.upgrades };
    }

    isHidden(id, max) {
        const amt = this.getUpgrade(id);
        return amt !== null && amt >= max;
    }

    getActiveUpgrades(upgradeData) {
        return upgradeData
            .filter(upg => this.hasUpgrade(upg.num))
            .map(upg => ({
                ...upg,
                amt: this.getUpgrade(upg.num),
                hidden: upg.max !== undefined && this.getUpgrade(upg.num) >= upg.max
            }));
    }
}