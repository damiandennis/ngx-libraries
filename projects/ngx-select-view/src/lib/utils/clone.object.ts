export default function cloneObject(o: any) {
    return JSON.parse(JSON.stringify(o));
}
