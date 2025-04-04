import React, { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import BaseTable from "./BaseTable";
import { Button, Spinner } from "reactstrap";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    // ✅ Fetch category list from Swagger API
    const fetchCategories = async () => {
        try {
            const data = await ApiService.getCategories();
            setCategories(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Add a new category
    const handleAddCategory = async () => {
        const newCategory = { name: "New Category" };

        try {
            await ApiService.addCategory(newCategory);
            fetchCategories(); // Refresh list after adding
        } catch (error) {
            console.error("Failed to add category:", error);
        }
    };

    // ✅ View category details
    const handleViewCategory = async (categoryId) => {
        try {
            const category = await ApiService.getCategoryById(categoryId);
            alert(`Category Details:\n\nID: ${category.id}\nName: ${category.name}`);
        } catch (error) {
            console.error("Failed to fetch category details:", error);
        }
    };

    // Define table columns
    const columns = [
        { key: "id", title: "ID" },
        { key: "name", title: "Category Name" },
        {
            key: "actions",
            title: "Actions",
            render: (_, row) => (
                <Button color="info" size="sm" onClick={() => handleViewCategory(row.id)}>
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            <h2>Category List</h2>
            <Button color="primary" onClick={handleAddCategory} className="mb-3">
                Add Category
            </Button>

            {loading ? (
                <Spinner color="primary" />
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <BaseTable columns={columns} data={categories} />
            )}
        </div>
    );
};

export default CategoryList;
