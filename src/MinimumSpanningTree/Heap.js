module.exports = class Heap {
    constructor(max = false) {
        this.heap = [null];
        this.max = max;
    }

    size() {
        return this.heap.length - 1;
    }

    peek() {
        return this.heap[1]
    }

    findNode(n) {
        for(let i = 1; i < this.heap.length; i++){
            if(n === this.heap[i].value) return i;
        }
    }


    insert(node) {
        this.heap.push(node);
        this.bubleUp(this.heap.length - 1)
    }

    remove() {
        if (this.heap.length < 3) {
            const toReturn = this.heap.pop();
            this.heap[0] = null;
            return toReturn;
        }

        const toRemove = this.heap[1];
        this.heap[1] = this.heap.pop();

        this.bubleDown();
        return toRemove;
    }

    bubleDown(n = 1) {
        const swapIdx = this.compareWithChildrens(n);


        if (swapIdx != null && this.heap[swapIdx]) {

            if (this.heap[swapIdx].minCost === null && this.heap[swapIdx].minCost >= this.heap[n].minCost) return;

            let temp = this.heap[swapIdx];
            if(temp.minCost === null) return;
            this.heap[swapIdx] = this.heap[n];
            this.heap[n] = temp;

            this.bubleDown(swapIdx);
        }
    }

    compareWithChildrens(n) {
        let [left, right] = [2 * n, 2 * n + 1];

        if (this.max) {
            return this.heap[right].minCost && this.heap[right].minCost >= this.heap[left].minCost ? right : left;
        } else {
            return this.heap[right] &&
            this.heap[right].minCost != null &&
            this.heap[left].minCost >= this.heap[right].minCost
                ? right : left;
        }

    }

    bubleUp(n, parentIdx = this.getParentIdx(n)) {
        if (parentIdx != null && this.shouldSwapWithParent(n)) {
            const tmp = this.heap[parentIdx];
            this.heap[parentIdx] = this.heap[n];
            this.heap[n] = tmp;

            this.bubleUp(parentIdx);
        }
    }

    getParentIdx(n) {
        if (n < 2) return null;
        const idx = n % 2 === 0 ? n / 2 : Math.floor(n / 2);
        return idx;
    }

    shouldSwapWithParent(n) {
        const parentIdx = this.getParentIdx(n);
        if (parentIdx === null) return false;

        const parent = this.heap[parentIdx];
        if (this.max) {
            return parent.minCost < this.heap[n].minCost;
        } else {
            return parent.minCost === null || parent.minCost > this.heap[n].minCost;
        }
    }

};