import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PiletApi, Pilet, PiletMetadata, EventEmitter } from 'piral-base';
import { PiletCustomApi } from './custom';
import { AnyComponent } from './components';
import { ExtensionSlotProps, PiralExtensionSlotMap } from './extension';
import { SharedData, DataStoreOptions } from './data';

export { PiletApi, Pilet, PiletMetadata, EventEmitter };

export interface BaseComponentProps {
  /**
   * The currently used pilet API.
   */
  piral: PiletApi;
}

export interface ExtensionComponentProps<T extends keyof PiralExtensionSlotMap> extends BaseComponentProps {
  /**
   * The provided parameters for showing the extension.
   */
  params: PiralExtensionSlotMap[T];
}

export interface RouteBaseProps<UrlParams = any, UrlState = any>
  extends RouteComponentProps<UrlParams, {}, UrlState>,
    BaseComponentProps {}

export interface PageComponentProps<T = any, S = any> extends RouteBaseProps<T, S> {}

/**
 * Defines the Pilet API from piral-core.
 */
export interface PiletCoreApi {
  /**
   * Gets a shared data value.
   * @param name The name of the data to retrieve.
   */
  getData<TKey extends string>(name: TKey): SharedData[TKey];
  /**
   * Sets the data using a given name. The name needs to be used exclusively by the current pilet.
   * Using the name occupied by another pilet will result in no change.
   * @param name The name of the data to store.
   * @param value The value of the data to store.
   * @param options The optional configuration for storing this piece of data.
   * @returns True if the data could be set, otherwise false.
   */
  setData<TKey extends string>(name: TKey, value: SharedData[TKey], options?: DataStoreOptions): boolean;
  /**
   * Registers a route for predefined page component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param Component The component to render the page.
   */
  registerPage(route: string, Component: AnyComponent<PageComponentProps>): void;
  /**
   * Unregisters the page identified by the given route.
   * @param route The route that was previously registered.
   */
  unregisterPage(route: string): void;
  /**
   * Registers an extension component with a predefined extension component.
   * The name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param Component The component to be rendered.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtension<T extends keyof PiralExtensionSlotMap>(
    name: T,
    Component: AnyComponent<ExtensionComponentProps<T>>,
    defaults?: T,
  ): void;
  /**
   * Unregisters a global extension component.
   * Only previously registered extension components can be unregistered.
   * @param name The name of the extension slot to unregister from.
   * @param Component The registered extension component to unregister.
   */
  unregisterExtension<T extends keyof PiralExtensionSlotMap>(
    name: T,
    Component: AnyComponent<ExtensionComponentProps<T>>,
  ): void;
  /**
   * React component for displaying extensions for a given name.
   */
  Extension: ComponentType<ExtensionSlotProps>;
  /**
   * Renders an extension in a plain DOM component.
   * @param element The DOM element or shadow root as a container for rendering the extension.
   * @param props The extension's rendering props.
   */
  renderHtmlExtension(element: HTMLElement | ShadowRoot, props: ExtensionSlotProps): void;
}

declare module 'piral-base/lib/types' {
  interface PiletApi extends PiletCustomApi, PiletCoreApi {}
}

export interface PiletsBag {
  [name: string]: PiletApi;
}
