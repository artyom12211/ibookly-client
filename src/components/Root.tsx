import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { 
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

import 'remixicon/fonts/remixicon.css';

import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { publicUrl } from '@/helpers/publicUrl.ts';


const queryClient = new QueryClient()

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <TonConnectUIProvider
        manifestUrl={publicUrl('tonconnect-manifest.json')}
      >
        <QueryClientProvider client={queryClient}>
          <App/>
        </QueryClientProvider>
      </TonConnectUIProvider>
    </ErrorBoundary>
  );
}
