"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const spotify_1 = __importDefault(require("../../clients/spotify"));
let SpotifyResolver = class SpotifyResolver {
    getSpotifyAlbums(query) {
        return spotify_1.default
            .request(`https://api.spotify.com/v1/${query}`)
            .then(function (data) {
            let sth = JSON.stringify(data);
            return sth;
        })
            .catch((err) => {
            console.log(err.message);
            return err.message;
        });
    }
};
__decorate([
    type_graphql_1.Query((returns) => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], SpotifyResolver.prototype, "getSpotifyAlbums", null);
SpotifyResolver = __decorate([
    type_graphql_1.Resolver()
], SpotifyResolver);
exports.default = SpotifyResolver;
//# sourceMappingURL=SpotifyResolver.js.map