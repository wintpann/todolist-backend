const array = {
    last: (arr) => arr[arr.length - 1],
    exceptLast: (arr) => arr.slice(0, arr.length - 1),
};

const record = (...composites) => {
    const dependencies = array.exceptLast(composites);
    const project = array.last(composites);

    const resolve = (record) => {
        if (!Object.hasOwn(resolve, 'instance')) {
            resolve.instance = project(
                ...dependencies.map((dependency) => {
                    const isRecord = typeof dependency === 'function';

                    if (isRecord) {
                        const isAltered =
                            dependency.alterKey !== undefined &&
                            Object.hasOwn(record, dependency.alterKey);

                        if (isAltered) {
                            return record[dependency.alterKey];
                        }

                        if (!Object.hasOwn(dependency, 'instance')) {
                            dependency.instance = dependency(record);
                        }
                        return dependency.instance;
                    }

                    return record[dependency.key];
                }),
            );
        }

        return resolve.instance;
    };

    resolve.alterBy = (key) => {
        resolve.alterKey = key;
        delete resolve.alterBy;
        return resolve;
    };

    return resolve;
};

const key = () => (key) => ({ key });

export const di = {
    record,
    key,
};
