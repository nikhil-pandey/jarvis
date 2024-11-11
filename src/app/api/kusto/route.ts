import { NextResponse } from 'next/server';
import {
  KustoConnectionStringBuilder,
  Client as KustoClient,
  ClientRequestProperties,
} from 'azure-kusto-data';
import { v4 as uuidv4 } from 'uuid';
import { handleAxiosError } from '@/lib/errors';

let deviceAuthKcs: KustoConnectionStringBuilder | null = null;

export async function POST(request: Request) {
  try {
    console.log('Received request to execute Kusto query');
    const { query, settings } = await request.json();

    if (!settings?.clusterUri || !settings?.database) {
      return NextResponse.json({ error: 'Missing required settings' }, { status: 400 });
    }

    let kcs;

    const useDeviceAuth = settings.useDeviceAuth === true || settings.useDeviceAuth === undefined ? false : Boolean(settings.useDeviceAuth);
    if (useDeviceAuth) {
      if (!settings.tenantId) {
        return NextResponse.json({ error: 'TenantId required for device auth' }, { status: 400 });
      }

      // Reuse existing device auth connection if available
      if (!deviceAuthKcs) {
        deviceAuthKcs = KustoConnectionStringBuilder.withAzLoginIdentity(
          settings.clusterUri,
          settings.tenantId,
        );
        console.log('Created new Kusto connection string builder with device auth');
      }
      kcs = deviceAuthKcs;
    } else {
      if (!settings.appId || !settings.tenantId || !settings.certificate) {
        return NextResponse.json(
          { error: 'Missing required certificate auth settings' },
          { status: 400 }
        );
      }

      const certificate = Buffer.from(settings.certificate, 'base64').toString('utf8');
      kcs = KustoConnectionStringBuilder.withAadApplicationCertificateAuthentication(
        settings.clusterUri,
        settings.appId,
        certificate,
        settings.tenantId,
        settings.sendX5C
      );
    }

    const kustoClient = new KustoClient(kcs);

    try {
      const clientRequestProps = new ClientRequestProperties();
      clientRequestProps.setTimeout(1000 * 60);
      clientRequestProps.clientRequestId = `ChatInterface.KustoTool;${uuidv4()}`;

      const results = await kustoClient.execute(settings.database, query, clientRequestProps);

      return NextResponse.json({
        data: results.primaryResults[0].toString(),
      });
    } finally {
      await kustoClient.close();
    }
  } catch (error) {
    console.trace('Error executing Kusto query:', error);
    const errorResponse = handleAxiosError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
