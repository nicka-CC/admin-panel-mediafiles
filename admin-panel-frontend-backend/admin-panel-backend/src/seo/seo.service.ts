import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SEO } from './seo.model';
import { SeoDto } from './dto/create-seo.dto';
import { SEOPreset } from './seo-presets/seo-presets.model';

@Injectable()
export class SeoService {
  keysValuesIdentity: string[] = ['seo_title', 'seo_description'];
  constructor(@InjectModel(SEO) private seoRepository: typeof SEO) {}

  /**creatinf seo*/
  async createSeo(createDto: SeoDto): Promise<SEO> {
    return await this.seoRepository.create(createDto);
  }

  /**update information seo*/
  async updateSeo(id: number, updateDto: SeoDto): Promise<SEO> {
    return await this.seoRepository
      .update(updateDto, { where: { id: id }, returning: true })
      .then(([, affectedRows]) => {
        if (affectedRows) {
          return affectedRows[0];
        }
      });
  }

  public checkManualChangeSeo(
    seoDto: SeoDto | undefined,
    seoPreset: SEOPreset | undefined,
    seo: SEO | undefined,
  ): boolean {
    if (!seoDto && !seoPreset && !seo) {
      return true;
    }
    if (!seoPreset) {
      return true;
    }
    if (!seoDto && !seo) {
      return false;
    }
    for (const key of this.keysValuesIdentity) {
      if (!seoDto) {
        if (seo[key] != seoPreset[key]) {
          return true;
        }
      }
      if (key in seoDto) {
        if (seoDto[key] != seoPreset[key]) {
          return true;
        }
      }
    }
    return false;
  }

  public seoSwitch(manual_seo: boolean, seo: SEO, seoPreset?: SEOPreset): SEO {
    if (manual_seo || !seoPreset) {
      return seo;
    }
    for (const key of this.keysValuesIdentity) {
      seo[key] = seoPreset[key];
    }
    return seo;
  }
}
