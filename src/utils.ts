const LOCK = Symbol();

interface Lockable {
  [LOCK]?: Promise<void>;
}

export function noParallel<T extends (...args: any[]) => Promise<any>>(target: object,
                                                                       propertyKey: string | symbol,
                                                                       descriptor: TypedPropertyDescriptor<T>):
    TypedPropertyDescriptor<T> {
  const method = descriptor.value!;
  return {
    async value(this: Lockable, ...args: any[]): Promise<any> {
      while (this[LOCK]) {
        await this[LOCK];
      }

      const result = new Promise<any>((resolve, reject) => {
        method.apply(this, args)
            .then(result => {
              delete this[LOCK];
              resolve(result);
            })
            .catch(reason => {
              delete this[LOCK];
              reject(reason);
            });
      });

      this[LOCK] = new Promise(resolve => result
          .then(() => resolve())
          .catch(() => resolve()));

      return result;
    }
  } as TypedPropertyDescriptor<T>;
}
