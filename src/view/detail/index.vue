<template>
    <transition name="el-fade-in-linear">
        <div class="video_detail" v-show="detailData">
            <headerTop />

            <div class="detail_container">
                <div class="introduce">
                    <div class="poster_img" @click="playVideo(detailData.displayType =='MOVIE' ? detailData.outAlbumId : detailData.conContentBeans[0].outId , detailData.displayType =='MOVIE' ? detailData.payMark : detailData.conContentBeans[0].payMark);playRecode(detailData,detailData.displayType ==='MOVIE' ? 3 : 1,detailData.conContentBeans[0])">
                        <img :src="detailData.poster"   alt="">
                        <img class="play_icon" src="../../../static/img/play_icon.png" alt="">
                        <img class="play_background" src="../../../static/img/play_background.png" alt="">
                    </div>
                    <div class="desc">
                        <div class="title">
                            <div class="video_name">{{detailData.elementName}}</div>
                            <div class="detail_type"> <p>{{videoType[detailData.displayType]}}</p></div>
                            <div  v-if="detailData.displayType !=='PROGRAM'" class="score_show">
                                <span class="score_left">评分:</span>
                                <span class="score_middle">{{score[0]}}.</span>
                                <span class="score_right">{{score[1]}}</span>
                            </div>
                        </div>
                        <ul v-if="detailData.displayType ==='MOVIE'">
                            <li>地区：{{detailData.areaName}}</li>
                            <li v-if="direct">导演：<span v-for="item in direct">{{item}}</span></li>
                            <li v-if="actors">主演：<span v-for="item in actors">{{item}}</span></li>
                            <li>时长：{{detailData.duration}}</li>
                            <li>标签：<span v-for="item in tags">{{item}}</span></li>
                        </ul>
                        <ul v-if="detailData.displayType ==='PROGRAM'">
                            <li>地区：{{detailData.areaName}}</li>
                            <li v-if="detailData.direct">主持人：{{detailData.direct}}</li>
                            <li v-if="detailData.actors">嘉宾：<span v-for="item in actors">{{item}}</span></li>
                            <li>更新集数：{{detailData.upStatusDesc}}</li>
                            <li>标签：<span v-for="item in tags">{{item}}</span></li>
                        </ul>
                        <ul v-if="detailData.displayType ==='ALBUM'">
                            <li>地区：{{detailData.areaName}}</li>
                            <li v-if="direct">导演： <span v-for="item in direct">{{item}}</span></li>
                            <li v-if="actors">主演：<span v-for="item in actors">{{item}}</span></li>
                            <li>总集数：{{detailData.upStatusDesc}}</li>
                            <li>标签：<span v-for="item in tags">{{item}}</span></li>
                        </ul>
                        <div class="play" @click="playVideo(detailData.displayType ==='MOVIE' ? detailData.outAlbumId : detailData.conContentBeans[0].outId , detailData.displayType =='MOVIE' ? detailData.payMark : detailData.conContentBeans[0].payMark);playRecode(detailData,detailData.displayType ==='MOVIE' ? 3 : 1,detailData.conContentBeans[0])"><span>立即播放</span></div>
                        <div class="collection_show">
                            <div v-show="!favoriteIds" :class="!favoriteState ? 'show_icon' : 'no_show_icon' " @click="setFavorite()" class="no_collection"> 收藏</div>
                            <div v-show="favoriteIds" :class="favoriteState ?'show_icon' : 'no_show_icon'" @click="removeFavorite(favoriteIds)" class="collection">已收藏</div>
                        </div>
                    </div>
                    <div class="hot_recommend">
                        <div class="recommend_title">{{hotData.moduleTitle}}</div>
                        <ul>
                            <li v-for="(v,k) in hotData.elements" v-click-report="{dom:detailData,moduleId:'05',route:'detail',item:v}" @click="jumpToOtherDetail(v.jumpId)">
                                <div class="hot_index">{{k+1}}</div>
                                <div class="hot_video">{{v.elementName}}</div>
                                <div class="hot_desc" v-if="v.displayType !='MOVIE'">{{v.upStatusDesc}}</div>
                                <div class="hot_desc" v-if="v.displayType =='MOVIE'">{{v.duration}}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <episodeList v-if="detailData.displayType ==='PROGRAM' && detailData.variety" :detailData="detailData" :vid="videoId" :videoType="detailData.displayType" :yearArr="detailData.variety.year" :vipList="detailData.vipTV" :videoName="detailData.elementName" />
            <episodeList v-if="detailData.displayType ==='ALBUM'" :detailData="detailData" :vid="videoId" :videoType="detailData.displayType" :episodes="detailData.episodes || detailData.conContentBeans.length" :vipList="detailData.vipTV"/>
            <div class="detail_footer">
                <div class="detail_footer_title">
                    <ul>
                        <li :class="checkedModule === 1 ? 'active' : ''"  v-if="detailData.displayType" v-click-report="{dom:detailData,moduleId:'01',route:'detail'}" @click="changeModule(1)">概述</li>
                        <li v-if="detailData.conContentBeans2 && detailData.conContentBeans2.length > 0" :class="checkedModule === 2 ? 'active' : ''" @click="changeModule(2)">{{detailData.displayType==='PROGRAM' ? '最新资讯' : '预告与花絮'}} </li>
                        <li v-if="guessData.elements && guessData.elements.length > 0" :class="checkedModule === 3 ? 'active' : ''" @click="changeModule(3)">猜你喜欢</li>
                        <li v-if="recommendData.elements && recommendData.elements.length > 0" :class="checkedModule === 4 ? 'active' : ''" @click="changeModule(4)">相关推荐</li>
                    </ul>
                </div>
                <transition >
                    <div v-if="checkedModule === 1">
                        <div class="footer_desc">{{detailData.description}}</div>
                    </div>
                </transition>

                <transition name="el-fade-in-linear">
                    <div v-if="checkedModule === 2">
                        <ul class="list-wrap-content clearfix" :id="detailData.displayType ==='PROGRAM' ? 'program_list_item' : ''">
                            <li class="list-wrap-item" v-for="(item, index) in dataSource" :key="index">
                                <highLightlistItem :dataSource="item" :moduleId="'02'" :detailData="detailData"/>
                            </li>
                        </ul>
                    </div>
                </transition>
                <transition name="el-fade-in-linear">
                    <div v-if="checkedModule === 3 " >
                        <ul class="list-wrap-content clearfix" :id="detailData.displayType ==='PROGRAM' ? 'program_list_item' : ''">
                            <li class="list-wrap-item" v-for="(item, index) in dataSource.elements" :key="index">
                                <listItem :dataSource="item" :pageType="detailData.displayType" :moduleId="'03'" />
                            </li>
                        </ul>
                    </div>
                </transition>
                <transition name="el-fade-in-linear">
                    <div v-if="checkedModule === 4" >
                        <ul class="list-wrap-content clearfix" :id="detailData.displayType ==='PROGRAM' ? 'program_list_item' : ''">
                            <li class="list-wrap-item" v-for="(item, index) in dataSource.elements" :key="index">
                                <listItem :dataSource="item" :pageType="detailData.displayType" :moduleId="'04'"/>
                            </li>
                        </ul>
                    </div>
                </transition>

                <!--<div v-if="checkedModule === 4">-->
                <!--<ul class="list-wrap-content clearfix" :id="detailData.displayType ==='PROGRAM' ? 'program_list_item' : ''">-->
                <!--<li class="list-wrap-item" v-for="(item, index) in dataSource.elements" :key="index">-->
                <!--<listItem :dataSource="item"/>-->
                <!--</li>-->
                <!--</ul>-->
                <!--</div>-->
            </div>
        </div>
    </transition>

</template>
<style  lang="less" src="./style.less"></style>
<script src="./script.js"></script>