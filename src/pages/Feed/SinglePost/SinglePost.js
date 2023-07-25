import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const graphqlQuery = {
      query: `query FetchPost($postId : ID!){
      getPostById(id: $postId) {
        title
        content
        createdAt
        imageUrl
        creator{
          name
        }
      }
    }`,
    variables : {
      postId: postId
    }
    };

    fetch(
      "https://blog-gl4c.onrender.com/graphql", //+ postId,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.props.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      }
    )
      .then((res) => {
        /*
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        */
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Failed to fetch the Post.");
        }

        this.setState({
          title: resData.data.getPostById.title,
          author: resData.data.getPostById.creator.name,
          date: new Date(resData.data.getPostById.createdAt).toLocaleDateString(
            "en-US"
          ),
          content: resData.data.getPostById.content,
          image:
            "https://blog-gl4c.onrender.com/" +
            resData.data.getPostById.imageUrl,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
