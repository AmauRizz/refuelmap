import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SyncService {
    private readonly logger = new Logger(SyncService.name);

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService,
    ) {}

    @Cron(CronExpression.EVERY_HOUR, {
        name: 'sync-stations',
        timeZone: 'Europe/Paris',
        waitForCompletion: true,
    })
    async syncStations() {
        this.logger.log('Starting sync with api.gouv');

        const url = this.config.get<string>('GOUV_API_URL', '');
        const { data } = await firstValueFrom(this.http.get(url));

        this.logger.log(`${data.length} stations retrieved`);
        this.logger.log(`Station sample: ${JSON.stringify(data[0], null, 2)}`);

        // TODO: upsert Prisma
    }

    async syncNow() {
        return this.syncStations();
    }
}