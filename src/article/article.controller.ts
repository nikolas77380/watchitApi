import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiUseTags,
  ApiOperation,
  ApiImplicitParam,
} from '@nestjs/swagger';

import { ArticleService } from './article.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import axios from 'axios';

@ApiUseTags('Article')
@Controller('article')
@UseGuards(RolesGuard)
export class ArticleController {
  private BASE_URL = `https://api.tvmaze.com/`;
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ title: 'Get All shows & search' })
  @ApiOkResponse({})
  async getAllArticle(@Query() query) {
    const { q, amount } = query;
    let queryString: string;
    let result: any[];
    if (q) {
      queryString = `${this.BASE_URL}search/shows?q=${q}`;
      const showsRequest = await axios.get(queryString);
      const data = showsRequest.data.map(el => el.show);
      result = amount ? data.slice(0, amount) : data;
    } else {
      queryString = `${this.BASE_URL}shows`;
      const showsRequest = await axios.get(queryString);
      result = amount ? showsRequest.data.slice(0, amount) : showsRequest.data;
    }

    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ title: 'Get One article' })
  @ApiImplicitParam({ name: 'id', description: 'id of article' })
  @ApiOkResponse({})
  async getOneArticles(@Param() params) {
    const { id } = params;
    const queryString = `${this.BASE_URL}shows/${id}`;
    const showRequest = await axios.get(queryString);
    return showRequest.data;
  }

  @Get('/byGenre/:genre')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ title: 'Get shows by genre' })
  @ApiImplicitParam({ name: 'genre', description: 'genre for show' })
  @ApiOkResponse({})
  async getByArticle(@Param() params, @Query() query) {
    const { amount } = query;
    const showsRequest = await axios.get(`${this.BASE_URL}shows`);
    const shows = showsRequest.data.filter(el =>
      el.genres
        .map(el => el.toLowerCase())
        .includes(params.genre.toLowerCase()),
    );
    return amount ? shows.slice(0, amount) : shows;
  }
  @Get('/byCountry/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ title: 'Get popular shows by country' })
  @ApiImplicitParam({ name: 'id', description: 'country id' })
  @ApiOkResponse({})
  async getPopularByCountry(@Param() params, @Query() query) {
    const { amount } = query;
    const showsRequest = await axios.get(
      `${this.BASE_URL}shows?Show%5Bcountry_enum%5D=${params.id}`,
    );
    const shows = showsRequest.data.sort(
      (a, b) => b.rating.average - a.rating.average,
    );
    return amount ? shows.slice(0, amount) : shows;
  }
  @Get('/popular')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ title: 'Get popular shows' })
  @ApiOkResponse({})
  async getMostPopular(@Param() params) {
    const showsRequest = await axios.get(`${this.BASE_URL}shows`);
    const shows = showsRequest.data
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, 9);
    return shows;
  }
  @Get('/actor/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ title: 'Get actor' })
  @ApiOkResponse({})
  async getActor(@Param() params) {
    const actorRequest = await axios.get(`${this.BASE_URL}people/${params.id}`);
    const casts = await axios.get(
      `${this.BASE_URL}people/${params.id}/castcredits`,
    );
    const castsData = casts.data;
    const actorData = actorRequest.data;

    return { ...actorData, casts: castsData.map(el => el._links) };
  }
}
