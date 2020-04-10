import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form } from 'react-bootstrap';

import { getPostAction, getSearchResultsAction, getPageChangeActions } from './action';
import PostDetailsModal from '../../components/PostDetailsModal';
import Pagination from '../../components/Pagination';


export class Post extends Component {
    intervalId;
    constructor(props) {
        super(props);
        this.state = {
            selectedPost: null
        }
    }

    getPost = () => {
        this.props.getPostAction(this.props.totalPages);
    }

    componentDidMount = () => {
        this.getPost();
        this.intervalId = setInterval(() => {
            this.getPost();
        }, 10000);
    }

    componentWillUnmount = () => {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    onSelectPost = selectedPost => {
        this.setState({
            ...this.state,
            selectedPost
        })
    }

    onModalClose = () => {
        this.setState({
            ...this.state,
            selectedPost: null
        });
    }

    onChange = (event) => {
        let searchKey = event.target.value;
        this.props.getSearchResultsAction(searchKey);
    }

    onPageChange = (event) => {
        const target = event.target;
        if (target && target.tagName.toLowerCase() === 'a') {
            const selectedPage = parseInt(target.text.trim());
            this.props.getPageChangeActions(selectedPage);
        }
    }

    render() {
        return (
            <div className="container m-5">
                {/* Search */}
                <Form>
                    <Form.Group controlId="searchTerm">
                        <Form.Control
                            type="text"
                            placeholder="Search by title, URl and author.."
                            onChange={(event) => this.onChange(event)}
                            value={this.props.searchTerm}
                        />
                    </Form.Group>
                </Form>

                {/* Table for post listing */}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>URL</th>
                            <th>Created At</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.currentPosts.map((post, index) => (
                            <tr key={index} onClick={() => this.onSelectPost(post)}>
                                <td className="ctd">{post.title}</td>
                                <td className="ctd">
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={post.url}
                                        onClick={e => e.stopPropagation()}
                                        title={post.url}>{post.url}
                                    </a>
                                </td>
                                <td className="ctd">{post.created_at}</td>
                                <td className="ctd">{post.author}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {this.props.currentActivePage ? (
                    <Pagination
                        currentActivePage={this.props.currentActivePage}
                        totalPages={this.props.totalPages}
                        onPageChange={this.onPageChange}
                    />
                ) : null}
                {this.state.selectedPost ? (
                    <PostDetailsModal
                        selectedPost={this.state.selectedPost}
                        onModalClose={this.onModalClose}
                    />
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {
        posts,
        pageNo,
        currentActivePage,
        totalPages,
        selectedPost,
        selectedPage,
        filteredPost,
        searchTerm,
        currentPosts
    } = state;
    return {
        posts,
        pageNo,
        currentActivePage,
        totalPages,
        selectedPost,
        selectedPage,
        filteredPost,
        searchTerm,
        currentPosts
    }
};

const mapDispatchToProps = {
    getPostAction,
    getSearchResultsAction,
    getPageChangeActions
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
