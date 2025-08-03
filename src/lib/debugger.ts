// Debug utility for Sk8Hub application
import React from 'react';

const isClient = typeof window !== 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';

interface DebugOptions {
  component?: string;
  action?: string;
  data?: unknown;
  level?: 'info' | 'warn' | 'error' | 'debug';
}

class Sk8HubDebugger {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = isDevelopment;
  }

  // Auto-debug function that logs component interactions
  log(message: string, options: DebugOptions = {}) {
    if (!this.isEnabled) return;

    const { component, action, data, level = 'debug' } = options;
    const timestamp = new Date().toISOString();
    const context = component ? `[${component}]` : '';
    const actionText = action ? ` ${action}:` : '';

    const logMessage = `🛹 Sk8Hub ${context}${actionText} ${message}`;

    switch (level) {
      case 'error':
        console.error(`${timestamp} ❌ ${logMessage}`, data || '');
        break;
      case 'warn':
        console.warn(`${timestamp} ⚠️ ${logMessage}`, data || '');
        break;
      case 'info':
        console.info(`${timestamp} ℹ️ ${logMessage}`, data || '');
        break;
      default:
        console.log(`${timestamp} 🐛 ${logMessage}`, data || '');
    }
  }

  // Auto-trace function calls
  trace(component: string, functionName: string, args?: unknown[]) {
    if (!this.isEnabled) return;

    console.group(`🔍 [${component}] ${functionName}()`);
    if (args && args.length > 0) {
      console.log('Arguments:', args);
    }
    console.trace();
    console.groupEnd();
  }

  // Auto-performance monitoring
  startTimer(label: string) {
    if (!this.isEnabled) return;
    console.time(`⏱️ ${label}`);
  }

  endTimer(label: string) {
    if (!this.isEnabled) return;
    console.timeEnd(`⏱️ ${label}`);
  }

  // Auto-state change logging
  stateChange(component: string, oldState: unknown, newState: unknown) {
    if (!this.isEnabled) return;

    console.group(`🔄 [${component}] State Change`);
    console.log('Previous State:', oldState);
    console.log('New State:', newState);
    console.log(
      'Changed Properties:',
      this.getChangedProperties(oldState, newState)
    );
    console.groupEnd();
  }

  // Auto-API call debugging
  apiCall(method: string, url: string, data?: unknown) {
    if (!this.isEnabled) return;

    console.group(`🌐 API ${method.toUpperCase()} ${url}`);
    if (data) {
      console.log('Request Data:', data);
    }
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }

  // Auto-error catching and reporting
  catchError(error: Error, context?: string) {
    if (!this.isEnabled) return;

    console.group(`💥 Error ${context ? `in ${context}` : ''}`);
    console.error('Error Message:', error.message);
    console.error('Stack Trace:', error.stack);
    console.groupEnd();
  }

  // Helper function to find changed properties
  private getChangedProperties(oldObj: unknown, newObj: unknown): string[] {
    const changes: string[] = [];

    if (
      !oldObj ||
      !newObj ||
      typeof oldObj !== 'object' ||
      typeof newObj !== 'object'
    ) {
      return changes;
    }

    const oldRecord = oldObj as Record<string, unknown>;
    const newRecord = newObj as Record<string, unknown>;

    Object.keys(newRecord).forEach(key => {
      if (oldRecord[key] !== newRecord[key]) {
        changes.push(key);
      }
    });

    return changes;
  }

  // Auto-component lifecycle debugging
  lifecycle(
    component: string,
    phase: 'mount' | 'update' | 'unmount',
    props?: unknown
  ) {
    if (!this.isEnabled) return;

    const emoji = {
      mount: '🎬',
      update: '🔄',
      unmount: '🎬',
    };

    console.log(`${emoji[phase]} [${component}] ${phase}`, props || '');
  }
}

// Global debugger instance
export const sk8Debug = new Sk8HubDebugger();

// Auto-debug React Hook
export const useAutoDebug = (componentName: string) => {
  if (!isDevelopment) return () => {};

  return (action: string, data?: unknown) => {
    sk8Debug.log(action, { component: componentName, data });
  };
};

// Auto-debug HOC for components
export const withAutoDebug = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName =
    componentName || WrappedComponent.displayName || WrappedComponent.name;

  const AutoDebugComponent = (props: P) => {
    const debug = useAutoDebug(displayName);

    React.useEffect(() => {
      debug('Component mounted');
      return () => debug('Component unmounted');
    }, [debug]);

    return React.createElement(WrappedComponent, props);
  };

  AutoDebugComponent.displayName = `withAutoDebug(${displayName})`;
  return AutoDebugComponent;
};

// Development-only breakpoint function
export const breakpoint = (label?: string) => {
  if (isDevelopment && isClient) {
    console.log(`🔴 Breakpoint: ${label || 'Debug point reached'}`);
    debugger; // This will trigger the browser debugger
  }
};

export default sk8Debug;
