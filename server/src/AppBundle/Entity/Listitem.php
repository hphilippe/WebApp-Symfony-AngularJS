<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;

/**
 * Listitem
 *
 * @ORM\Table(name="listitem", indexes={@ORM\Index(name="fk_Owns_CategoryMultimedia1_idx", columns={"id_categoryMultimedia"})})
 * @ORM\Entity
 *
 * @Serializer\ExclusionPolicy("all")
 * @Hateoas\Relation("self", href = "expr('/listitems/' ~ object.getId())")
 */
class Listitem
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_listItem", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @Serializer\Expose()
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=150, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="subTitle", type="string", length=200, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $subtitle;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", length=65535, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $description;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="realease_date", type="datetime", nullable=true)
     *
     * @Serializer\Expose()
     */
    private $realeaseDate;

    /**
     * @var boolean
     *
     * @ORM\Column(name="published", type="boolean", nullable=true)
     *
     * @Serializer\Expose()
     */
    private $published;

    /**
     * @var string
     *
     * @ORM\Column(name="pathCoverImage", type="string", length=255, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $pathcoverimage;

    /**
     * @var string
     *
     * @ORM\Column(name="pathPoster", type="string", length=255, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $pathposter;

    /**
     * @var string
     *
     * @ORM\Column(name="trailerUrl", type="string", length=255, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $trailerurl;

    /**
     * @var \AppBundle\Entity\Categorymultimedia
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Categorymultimedia")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_categoryMultimedia", referencedColumnName="id_categoryMultimedia")
     * })
     *
     * @Serializer\Expose()
     */
    private $idCategorymultimedia;



    /**
     * Get idListitem
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return Listitem
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set subtitle
     *
     * @param string $subtitle
     * @return Listitem
     */
    public function setSubtitle($subtitle)
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    /**
     * Get subtitle
     *
     * @return string 
     */
    public function getSubtitle()
    {
        return $this->subtitle;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return Listitem
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set realeaseDate
     *
     * @param \DateTime $realeaseDate
     * @return Listitem
     */
    public function setRealeaseDate($realeaseDate)
    {
        $this->realeaseDate = $realeaseDate;

        return $this;
    }

    /**
     * Get realeaseDate
     *
     * @return \DateTime 
     */
    public function getRealeaseDate()
    {
        return $this->realeaseDate;
    }

    /**
     * Set published
     *
     * @param boolean $published
     * @return Listitem
     */
    public function setPublished($published)
    {
        $this->published = $published;

        return $this;
    }

    /**
     * Get published
     *
     * @return boolean 
     */
    public function getPublished()
    {
        return $this->published;
    }

    /**
     * Get pathcoverimage
     *
     * @return string
     */
    public function getPathcoverimage()
    {
        return $this->pathcoverimage;
    }

    /**
     * Set pathcoverimage
     *
     * @param string $pathcoverimage
     * @return Listitem
     */
    public function setPathcoverimage($pathcoverimage)
    {
        $this->pathcoverimage = $pathcoverimage;

        return $this;
    }

    /**
     * Get pathposter
     *
     * @return string 
     */
    public function getPathposter()
    {
        return $this->pathposter;
    }

    /**
     * Set pathposter
     *
     * @param string $pathposter
     * @return Listitem
     */
    public function setPathposter($pathposter)
    {
        $this->pathposter = $pathposter;

        return $this;
    }

    /**
     * Get trailerurl
     *
     * @return string
     */
    public function getTrailerurl()
    {
        return $this->trailerurl;
    }

    /**
     * Set trailerurl
     *
     * @param string $trailerurl
     * @return Listitem
     */
    public function setTrailerurl($trailerurl)
    {
        $this->trailerurl = $trailerurl;

        return $this;
    }

    /**
     * Set idCategorymultimedia
     *
     * @param \AppBundle\Entity\Categorymultimedia $idCategorymultimedia
     * @return Listitem
     */
    public function setIdCategorymultimedia(\AppBundle\Entity\Categorymultimedia $idCategorymultimedia = null)
    {
        $this->idCategorymultimedia = $idCategorymultimedia;

        return $this;
    }

    /**
     * Get idCategorymultimedia
     *
     * @return \AppBundle\Entity\Categorymultimedia 
     */
    public function getIdCategorymultimedia()
    {
        return $this->idCategorymultimedia;
    }
}
