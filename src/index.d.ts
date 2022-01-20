// eslint-disable-next-line no-unused-vars
declare namespace flatList{
    type Component = any;
    type Page = any;

    interface options<T> {
        id: string;
        dataKey: string;
        page: Component | Page;
    }

    interface FlatList<T> {
        appendList(list: T[], callback?: () => void)
        clearList(callback?: () => void)
        getAllList(): T[]
        getCurrentRenderIndex():Number
        destroy()
    }
}
declare function createFlatListContext<T>(op:flatList.options<T>): flatList.FlatList<T>

export = createFlatListContext;
