import {EventEmitter as UntypedEventEmitter} from 'events';

export declare class EventEmitter<V extends Record<keyof V, (...args: any[]) => void>> {
  public addListener<E extends keyof V>(event: E, listener: V[E]): this;

  public on<E extends keyof V>(event: E, listener: V[E]): this;

  public once<E extends keyof V>(event: E, listener: V[E]): this;

  public prependListener<E extends keyof V>(event: E, listener: V[E]): this;

  public prependOnceListener<E extends keyof V>(event: E, listener: V[E]): this;

  public removeListener<E extends keyof V>(event: E, listener: V[E]): this;

  public off<E extends keyof V>(event: E, listener: V[E]): this;

  public removeAllListeners<E extends keyof V>(event?: E): this;

  public listeners<E extends keyof V>(event: E): V[E][];

  public rawListeners<E extends keyof V>(event: E): V[E][];

  public emit<E extends keyof V>(event: E, ...args: Parameters<V[E]>): boolean;

  public eventNames<E extends keyof V>(): E[];

  public listenerCount(type: keyof V): number;
}

module.exports = {EventEmitter: UntypedEventEmitter};
