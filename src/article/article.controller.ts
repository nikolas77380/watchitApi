import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiUseTags,
    ApiBearerAuth,
    ApiImplicitHeader,
    ApiOperation,
    ApiImplicitParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from './../auth/decorators/roles.decorator';
import axios from 'axios';

@ApiUseTags('Article')
@Controller('article')
@UseGuards(RolesGuard)
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Get All article',})
    @ApiOkResponse({})
    async getAllArticle() {
        return await this.articleService.getAllArticles();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Get One article',})
    @ApiImplicitParam({name: 'id', description: 'id of article'})
    @ApiOkResponse({})
    async getOneArticles(@Param() params) {
        return await this.articleService.getOneArticle(params.id);
    }

    @Get('/byGenre/:genre')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Get shows by genre',})
    @ApiImplicitParam({name: 'genre', description: 'genre for show'})
    @ApiOkResponse({})
    async getByArticle(@Param() params) {
        const showsRequest = await axios.get('https://api.tvmaze.com/shows');
        const shows = showsRequest.data.filter(el => el.genres.includes(params.genre)).slice(0, 9);
        return shows;
    }
    @Get('/byCountry/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Get popular shows by country',})
    @ApiImplicitParam({name: 'id', description: 'country id'})
    @ApiOkResponse({})
    async getPopularByCountry(@Param() params) {
        const showsRequest = await axios.get(`https://www.tvmaze.com/shows?Show%5Bcountry_enum%5D=${params.id}`);
        const shows = showsRequest.data.sort((a, b) => b.rating.average - a.rating.average).slice(0, 9);
        return shows;
    }
    @Get('/popular')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Get popular shows',})
    @ApiOkResponse({})
    async getMostPopular(@Param() params) {
        const showsRequest = await axios.get('https://api.tvmaze.com/shows');
        const shows = showsRequest.data.sort((a, b) => b.rating.average - a.rating.average).slice(0, 9);
        return shows;
    }
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({title: 'Create one article',})
    @ApiBearerAuth()
    @ApiImplicitHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiCreatedResponse({})
    async createArticle(@Body() createArticleDto: CreateArticleDto) {
        return await this.articleService.createArticle(createArticleDto);
    }


    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({title: 'Update one article by id ( all params )',})
    @ApiBearerAuth()
    @ApiImplicitParam({name: 'id', description: 'id of article'})
    @ApiImplicitHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async updateWithAllParams(@Param() params, @Body() createArticleDto: CreateArticleDto) {
        return await this.articleService.updateArticlePut(params.id, createArticleDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({title: 'Delete one article',})
    @ApiBearerAuth()
    @ApiImplicitHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiImplicitParam({name: 'id', description: 'id of article we want to delete.'})
    @ApiOkResponse({})
    async deleteOneArticle(@Param() params) {
        return await this.articleService.deleteArticle(params.id);
    }
}
