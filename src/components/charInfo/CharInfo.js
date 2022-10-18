import { Component } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import MarvelService from "../../services/MarvelService";

import "./charInfo.scss";
import thor from "../../resources/img/thor.jpeg";

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return;
    }
    this.onLoading();
    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  onLoading = () => {
    this.setState({
      loading: true,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onCharLoaded = (char) => {
    this.setState({
      char,
      loading: false,
    });
  };

  render() {
    const { char, loading, error } = this.state;

    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
      <div className="char__info">
        {skeleton}
        {spinner}
        {errorMessage}
        {content}
      </div>
    );
  }
}

const ComicsList = (props) => {
  const { comics, comicsOnPage } = props;
  let comicsList = [];
  for (let i = 0; i <= comicsOnPage && i <= comics.length - 1; i++) {
    let url = comics[i].resourceURI ? comics[i].resourceURI : "#";
    comicsList.push(
      <li className="char__comics-item" key={i}>
        <a href={url}>{comics[i].name}</a>
      </li>
    );
  }
  return comicsList;
};

const ShowMoreBtn = ({ more }) => {
  return (
    <button className="button button__main button__long">
      <div className="inner">load {more} more</div>
    </button>
  );
};

const View = ({ char }) => {
  const {
    name,
    description,
    thumbnail,
    thumbnailStyle,
    homepage,
    wiki,
    comics,
  } = char;

  const comicsOnPage = 10,
    comicsAmount = comics.length;

  const comicsList =
    comicsAmount > 0 ? (
      <ComicsList comics={comics} comicsOnPage={comicsOnPage} />
    ) : null;

  const showMoreBtn =
    comicsAmount - comicsOnPage > 0 ? (
      <ShowMoreBtn more={comicsAmount - comicsOnPage} />
    ) : null;

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={thumbnailStyle} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Avalible comics: {comicsAmount} </div>
      <ul className="char__comics-list">{comicsList}</ul>
      {showMoreBtn}
    </>
  );
};
export default CharInfo;
