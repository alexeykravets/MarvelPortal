class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    _apiKey = 'apikey=34601e09ecdd8fc496dc8f90254537df'
    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`)
        return res.data.results.map(this._transformCharacter)
    }
    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`)
        return this._transformCharacter(res.data.results[0])
    }
    _transformCharacter = (char) => {
        let description = char.description,
            thumbnail = char.thumbnail.path + '.' + char.thumbnail.extension,
            thumbnailStyle = {'objectFit' : 'cover'}
            
        if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            thumbnailStyle = {'objectFit' : 'unset'};
        }

        return {
            id: char.id,
            name: char.name,
            description: description ? description : 'No description yet, Sorry! :(',
            thumbnail:  thumbnail,
            thumbnailStyle: thumbnailStyle,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;
