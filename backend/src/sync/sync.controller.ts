import { Controller, Post, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
    constructor(private readonly sync: SyncService) {}

    @Post()
    trigger() {
        return this.sync.syncNow();
    }
}