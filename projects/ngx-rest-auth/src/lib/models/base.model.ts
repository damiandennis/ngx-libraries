export abstract class BaseModel {

    /**
     *  data The data to map to the model.
     */
    constructor(data?: any) {
        if (data) {
            Object.keys(data)
              .map((key) => {
                this[key] = data[key];
              });
        }
    }
}
