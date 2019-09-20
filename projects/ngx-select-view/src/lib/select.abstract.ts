export class SelectAbstract {

    public static uniqueIndex = 0;

    public id: any;
    public isSearchHidden: boolean = true;
    public valueText = "";

    constructor() {
        this.id = ++SelectAbstract.uniqueIndex;
    }

    /**
     * Opens the search container but resets text and sets selection to below.
     */
    public openSearch() {
        this.isSearchHidden = false;
    }

}
