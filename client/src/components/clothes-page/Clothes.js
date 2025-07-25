import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@mui/material";
import clothesService from "../../service/serviceAPI";

import NavBar from "../navbar/NavBar";
import LoadingDimmer from "../LoadingDimmer";
import ClothesSearchBar from "./ClothesSearchBar";
import PathBreadcrumb from "./PathBreadcrumb";
import ClothesMenu from "./ClothesMenu";
import ClothesCard from "./ClothesCard";
import { WishlistContext } from "../../contexts/WishlistContext";

import { updateLocalWishlist } from "../../service/serviceLocalStorage";
import ClothesSortDropdown from "./ClothesSortDropdown";
import {ContentHorizontal, GridColumn} from "./StyledCardElements";

export default function Clothes({ genre }) {
    const [fetchComplete, setFetchComplete] = useState(false);
    const [fetchError, setFetchError] = useState({ code: null, msg: null });

    const [currClothes, setCurrClothes] = useState([]);
    const [allClothes, setAllClothes] = useState([]);

    const [brands, setBrands] = useState();
    const [types, setTypes] = useState();

    const [activeType, setActiveType] = useState();
    const [activeBrand, setActiveBrand] = useState(null);
    const [activeInput, setActiveInput] = useState(null);

    const [currImages, setCurrImages] = useState([]);

    const { wishlist, setWishlist } = useContext(WishlistContext);

    const filterByTypeAndBrand = () =>
        setCurrClothes(
            allClothes.filter(
                (cl) => cl.type === activeType.toString().toLowerCase() && cl.brand === activeBrand
            )
        );

    const filterByType = () =>
        setCurrClothes(
            allClothes.filter((cl) => cl.type === activeType.toString().toLowerCase())
        );

    const filterByBrand = () =>
        setCurrClothes(allClothes.filter((cl) => cl.brand === activeBrand));

    const removeMenuFilters = () => {
        setCurrClothes(allClothes);
        setCurrImages(
            allClothes.map((product) => ({
                code: product.code,
                currImage: product.images[0],
            }))
        );
    };

    const handleSortByPrice = () =>
        setCurrClothes(
            [...currClothes].sort((a, b) => {
                let currA = a.price,
                    currB = b.price;
                if (a.salesPrice) currA = a.salesPrice;
                if (b.salesPrice) currB = b.salesPrice;
                return currA - currB;
            })
        );

    const handleSortBySales = () =>
        setCurrClothes(
            [...currClothes].sort((a, b) => {
                if (a.salesPrice === 0) return 1;
                if (b.salesPrice === 0) return -1;
                return a.salesPrice - b.salesPrice;
            })
        );

    const handleSearchInput = (e, { value }) =>
        setCurrClothes(
            allClothes.filter((cl) =>
                cl.name.toLowerCase().includes(value.toLowerCase())
            )
        );

    const handleChangeImageClick = (cloth, color) => {
        let newImages = [...currImages];
        const imgOfColorChosen = cloth.images.find((i) => i.color === color);
        newImages.find((i) => i.code === cloth.code).currImage = imgOfColorChosen;
        setCurrImages(newImages);
    };

    const handleWishClick = (code) => {
        let newWishlist = [...wishlist];
        let newWishObj = currClothes.find((w) => w.code === code);
        const objIdx = newWishlist.findIndex((w) => w.code === newWishObj.code);
        objIdx > -1 ? newWishlist.splice(objIdx, 1) : newWishlist.push(newWishObj);
        setWishlist(newWishlist);
        updateLocalWishlist(newWishObj);
    };

    useEffect(() => {
        setFetchComplete(false);
        clothesService()
            .getProducts()
            .then((resp) => {
                if (resp.type === "error") {
                    setFetchError({ code: resp.code, msg: resp.msg });
                    return;
                }
                const clothes = genre
                    ? resp.data.filter((cl) => cl.genre === genre)
                    : resp.data.filter((cl) => cl.discount);
                setCurrClothes(clothes);
                setAllClothes(clothes);
                setFetchComplete(true);
            });
    }, [genre]);

    useEffect(() => {
        setCurrImages(
            currClothes.map((product) => ({
                code: product.code,
                currImage: product.images[0],
            }))
        );
        setTypes(
            currClothes
                .map((product) => product.type)
                .filter((v, i, typesArr) => typesArr.indexOf(v) === i)
                .sort()
        );
        setBrands(
            currClothes
                .map((product) => product.brand)
                .filter((v, i, brandsArr) => brandsArr.indexOf(v) === i)
                .sort()
        );
    }, [currClothes]);

    useEffect(() => {
        activeType
            ? activeBrand
                ? filterByTypeAndBrand()
                : filterByType()
            : activeBrand
                ? filterByBrand()
                : removeMenuFilters();
    }, [activeBrand, activeType]);

    return (
        <div>
            <br />
            <NavBar />
            {fetchComplete ?
                <>
                    <ClothesSearchBar
                        activeInput={activeInput}
                        handleSearchInput={handleSearchInput}
                        setActiveInput={setActiveInput}
                    />
                    <PathBreadcrumb activeType={activeType} genre={genre} />
                    <ClothesSortDropdown
                        handleSortByPrice={handleSortByPrice}
                        handleSortBySales={handleSortBySales}
                    />
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item xs={1}>
                            <ClothesMenu
                                activeType={activeType}
                                activeBrand={activeBrand}
                                brands={brands}
                                types={types}
                                setActiveType={setActiveType}
                                setActiveBrand={setActiveBrand}
                            />
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid container justifyContent="space-around" alignItems="flex-start"
                                      spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 6, md: 8, lg:12 }}>
                                    { currClothes.map((cloth, idx) => (
                                        <Grid item xs={3} sm={4} md={4} lg={4} key={idx}>
                                            <ClothesCard
                                                idx={idx}
                                                cloth={cloth}
                                                handleChangeImageClick={handleChangeImageClick}
                                                wishlist={wishlist}
                                                handleWishClick={handleWishClick}
                                                thumbnail={currImages.find((cl) => cl.code === cloth.code)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
                :
                <LoadingDimmer complete={fetchComplete} error={fetchError} />
            }
        </div>
    );
}
