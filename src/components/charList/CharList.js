import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { Component } from "react";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharsListLoaded)
      .catch(this.onError);
  }

  onCharsListLoaded = (charList) => {
    this.setState({
      charList,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  render() {
    const items = this.state.charList.map((item) => {
      return (
        <li
          className="char__item"
          key={item.id}
          onClick={() => {
            this.props.onCharSelected(item.id);
            console.log(item.id);
          }}
        >
          <img
            src={item.thumbnail}
            alt={item.name}
            style={item.thumbnailStyle}
          />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    const View = ({ items }) => {
      return <ul className="char__grid">{items}</ul>;
    };

    const { error, loading } = this.state;

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? <View items={items} /> : null;

    return (
      <div className="char__list">
        {spinner}
        {errorMessage}
        {content}
        {/* <li className="char__item char__item_selected">
                        <img src={abyss} alt="abyss"/>
                        <div className="char__name">Abyss</div>
                    </li> */}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
